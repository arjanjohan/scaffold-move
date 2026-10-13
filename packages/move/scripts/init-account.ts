import minimist from 'minimist';
import { checkCli, getProfile, getTarget, runCli } from './utils';

const args = minimist(process.argv.slice(2));
const target = getTarget(args.network);
checkCli(target.cli);

// Creates or replaces the account (CLI profile) for this network
const initArgs = ['init', '--profile', target.network, '--assume-yes'];
if (!target.chain) {
  if (!args['rest-url']) {
    console.error('Error: custom network requires --rest-url');
    process.exit(1);
  }
  initArgs.push('--network', 'custom', '--rest-url', args['rest-url']);
  if (args['faucet-url']) {
    initArgs.push('--faucet-url', args['faucet-url']);
  }
} else if (target.chain.network === 'custom') {
  initArgs.push('--network', 'custom', '--rest-url', target.chain.fullnode);
  if (target.chain.faucet_api) {
    initArgs.push('--faucet-url', target.chain.faucet_api);
  }
} else {
  initArgs.push('--network', target.chain.network);
  // The Aptos testnet faucet only works through its website
  if (target.chain.network === 'testnet') {
    initArgs.push('--skip-faucet');
  }
}

// `init` asks for a private key; an empty answer generates a new one
runCli(target, initArgs, '\n');
console.log(`\nAccount for ${target.network}: ${getProfile(target).account}`);

// Accounts are only funded by `init` when a faucet API is known, otherwise point to the faucet page
if (target.chain?.faucet_url && !target.chain.faucet_api) {
  console.log(`\nTo get test tokens for ${target.chain.name}, visit:`);
  console.log(target.chain.faucet_url);
}

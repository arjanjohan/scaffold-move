import minimist from 'minimist';
import { checkCli, findProfile, getProfile, getTarget, runCli } from './utils';

const args = minimist(process.argv.slice(2), { boolean: ['new'] });
const target = getTarget(args.network);
checkCli(target.cli);

// --new keeps the current account as a renamed profile, so its key isn't lost
const previous = findProfile(target)?.account;
if (args.new && previous) {
  const backup = `${target.network}_old_${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`;
  runCli(target, ['config', 'rename-profile', '--profile', target.network, '--new-profile-name', backup], {
    quiet: true,
  });
  console.log(`Previous account 0x${previous.replace(/^0x/, '')} kept as profile ${backup}`);
}

// Creates the account (CLI profile) for this network, or keeps the existing one
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

// `init` asks for a private key; an empty answer generates a new one, or keeps the existing one
const output = runCli(target, initArgs, { input: '\n', quiet: true });
const { account } = getProfile(target);
console.log(`${previous && !args.new ? 'Using existing' : 'Created'} account for ${target.network}: ${account}`);

// Accounts are only funded by `init` when a faucet API is known, otherwise point to the faucet page
if (output.includes('funded successfully')) {
  console.log('Funded from the faucet');
} else if (target.chain?.faucet_url && !target.chain.faucet_api) {
  console.log(`Get test tokens at ${target.chain.faucet_url}`);
}
if (target.chain?.block_explorer) {
  const networkParam = target.chain.explorer_network_param ? `?network=${target.chain.explorer_network_param}` : '';
  console.log(`Explorer: ${target.chain.block_explorer}/account/${account}${networkParam}`);
}

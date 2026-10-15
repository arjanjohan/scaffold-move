import minimist from 'minimist';
import { loadModules } from './load-modules';
import { Target, checkCli, createClient, getCompileArgs, getMoveTomlAddresses, getProfile, getTarget, runCli } from './utils';

// Stops before publishing from an account without funds, where the CLI would only fail with
// MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS. E.g. a new Aptos testnet account: its faucet is web-only.
async function checkBalance(target: Target, account: string): Promise<void> {
  const [balance] = await createClient(target).view<[string]>({
    payload: {
      function: '0x1::coin::balance',
      typeArguments: ['0x1::aptos_coin::AptosCoin'],
      functionArguments: [account],
    },
  });
  if (BigInt(balance) > 0n) {
    return;
  }
  const symbol = target.chain?.native_token_symbol ?? 'APT';
  console.error(`Account ${account} has no ${symbol} on ${target.network}.`);
  if (target.chain?.faucet_api) {
    console.error(`Fund it with \`yarn faucet ${account} --network ${target.network}\`, then run this again.`);
  } else if (target.chain?.faucet_url) {
    console.error(`Get test tokens at ${target.chain.faucet_url}, then run this again.`);
  } else {
    console.error('Fund it first, then run this again.');
  }
  process.exit(1);
}

async function main(): Promise<void> {
  const target = getTarget(minimist(process.argv.slice(2)).network);
  checkCli(target.cli);
  const { account } = getProfile(target);
  await checkBalance(target, account);

  // Addresses left unset in Move.toml ('_') are deployed to the network's account
  const namedAddresses = Object.entries(getMoveTomlAddresses())
    .filter(([, value]) => value === '_')
    .map(([name]) => `${name}=${account}`);

  runCli(target, [
    'move',
    'publish',
    '--profile',
    target.network,
    '--assume-yes',
    ...(namedAddresses.length ? ['--named-addresses', namedAddresses.join(',')] : []),
    ...getCompileArgs(target),
  ]);

  await loadModules(target);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

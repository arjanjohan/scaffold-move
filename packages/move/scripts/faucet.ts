import minimist from 'minimist';
import { createClient, getTarget } from './utils';

// Funds an address, e.g. a browser wallet, from the network's faucet API: `yarn faucet 0x… --network local`
const FAUCET_AMOUNT = 100_000_000; // 1 MOVE / APT (8 decimals)

async function main(): Promise<void> {
  const args = minimist(process.argv.slice(2), { string: ['_'] });
  const target = getTarget(args.network);
  const address = args._[0];
  if (!address) {
    console.error('Usage: yarn faucet <address> [--network <network>]');
    process.exit(1);
  }
  if (!target.chain?.faucet_api) {
    const page = target.chain?.faucet_url;
    console.error(`${target.network} has no faucet API.${page ? ` Get test tokens at ${page}` : ''}`);
    process.exit(1);
  }

  const symbol = target.chain.native_token_symbol ?? 'APT';
  // Waits for the transaction, not for an indexer (the local node runs none by default)
  const transaction = await createClient(target).fundAccount({
    accountAddress: address,
    amount: FAUCET_AMOUNT,
    options: { waitForIndexer: false },
  });
  console.log(`Sent 1 ${symbol} to ${address} on ${target.network} (transaction ${transaction.hash})`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

import { checkCli, getTarget, runCli } from './utils';

// Runs a local node with the CLI of the `local` network, the same CLI `yarn deploy --network local` publishes with.
// Always a new chain: resuming the previous one fails when it was stopped for more than ~100 seconds. The chain's
// clock is still at its last block, and the faucet's first (orderless) transaction then expires too far in the future.
const target = getTarget('local');
checkCli(target.cli);
runCli(target, ['node', 'run-localnet', '--force-restart', '--assume-yes', ...process.argv.slice(2)]);

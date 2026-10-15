import { checkCli, getTarget, runCli } from './utils';

// Runs a local node with the CLI of the `local` network, the same CLI `yarn deploy --network local` publishes with
const target = getTarget('local');
checkCli(target.cli);
runCli(target, ['node', 'run-localnet', ...process.argv.slice(2)]);

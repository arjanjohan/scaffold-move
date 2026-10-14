import { checkCli, getCompileArgs, getTarget, runCli } from './utils';

// Runs `<cli> move <args>` with the CLI and framework of --network, e.g. `yarn compile --network aptos_testnet`
const argv = process.argv.slice(2);
const networkIndex = argv.indexOf('--network');
const network = networkIndex >= 0 ? argv[networkIndex + 1] : undefined;
const moveArgs = networkIndex >= 0 ? [...argv.slice(0, networkIndex), ...argv.slice(networkIndex + 2)] : argv;

const target = getTarget(network);
checkCli(target.cli);
runCli(target, ['move', ...moveArgs, ...getCompileArgs(target)]);

import { checkCli, getCompileArgs, getTarget, runCli } from './utils';

// Runs `<cli> move <args>` with the CLI and framework of --network, e.g. `yarn compile --network aptos_testnet`.
// Without --network it uses the default network, so `yarn format` works with only the Movement CLI installed.
const argv = process.argv.slice(2);
const networkIndex = argv.indexOf('--network');
const network = networkIndex >= 0 ? argv[networkIndex + 1] : undefined;
const moveArgs = networkIndex >= 0 ? [...argv.slice(0, networkIndex), ...argv.slice(networkIndex + 2)] : argv;

const target = getTarget(network);
checkCli(target.cli);
// fmt doesn't compile, so it takes no framework arguments
runCli(target, ['move', ...moveArgs, ...(moveArgs[0] === 'fmt' ? [] : getCompileArgs(target))]);

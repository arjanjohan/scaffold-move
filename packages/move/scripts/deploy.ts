import minimist from 'minimist';
import { loadModules } from './load-modules';
import { checkCli, getCompileArgs, getMoveTomlAddresses, getProfile, getTarget, runCli } from './utils';

async function main(): Promise<void> {
  const target = getTarget(minimist(process.argv.slice(2)).network);
  checkCli(target.cli);
  const { account } = getProfile(target);

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

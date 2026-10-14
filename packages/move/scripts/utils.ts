import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';
import * as yaml from 'js-yaml';
import { Chain, defaultChains } from '@scaffold-move/common';
import { defaultNetwork } from '../move.config';

const packageDir = path.join(__dirname, '..');

export type Cli = Chain['cli'];

// Network a script runs for: a key of defaultChains, or `custom` for any other node (aptos CLI).
// The network name is also the CLI profile, so every network keeps its own account.
export interface Target {
  network: string;
  chain?: Chain;
  cli: Cli;
}

interface Profile {
  network?: string;
  account?: string;
  rest_url?: string;
}

interface Config {
  profiles?: Record<string, Profile>;
}

const cliInstallUrls: Record<Cli, string> = {
  aptos: 'https://aptos.dev/build/cli',
  movement: 'https://docs.movementnetwork.xyz/devs/movementcli',
};

// Major CLI versions the scripts are tested with. Movement only accepts bytecode v7, which aptos CLI 9 can't emit.
const testedCliMajor: Record<Cli, number> = { aptos: 9, movement: 7 };

export function getTarget(network: string = defaultNetwork): Target {
  const chains: Record<string, Chain> = defaultChains;
  const chain: Chain | undefined = chains[network];
  if (!chain && network !== 'custom') {
    console.error(`Unknown network: ${network}. Use one of: ${Object.keys(chains).join(', ')}, custom`);
    process.exit(1);
  }
  return { network, chain, cli: chain?.cli ?? 'aptos' };
}

// Stop when the CLI for the target network is missing, warn when its version is untested
export function checkCli(cli: Cli): void {
  let version: string;
  try {
    version = execSync(`${cli} --version`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    console.error(`The ${cli} CLI is not installed. See ${cliInstallUrls[cli]}`);
    process.exit(1);
  }
  console.log(`Using ${version}`);
  // e.g. an Aptos CLI renamed to `movement`, which keeps its accounts in .aptos/ instead of .movement/
  if (!version.startsWith(`${cli} `)) {
    console.error(`The \`${cli}\` command is ${version}, not the ${cli} CLI. See ${cliInstallUrls[cli]}`);
    process.exit(1);
  }
  if (parseInt(version.split(' ')[1], 10) !== testedCliMajor[cli]) {
    console.warn(`Warning: scaffold-move is tested with ${cli} CLI ${testedCliMajor[cli]}.x`);
  }
}

// Runs the target's CLI in packages/move and exits when it fails
export function runCli(target: Target, args: string[], input?: string): void {
  console.log(`Executing: ${target.cli} ${args.join(' ')}`);
  const result = spawnSync(target.cli, args, {
    cwd: packageDir,
    input,
    stdio: [input === undefined ? 'inherit' : 'pipe', 'inherit', 'inherit'],
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Extra arguments to compile for the target network
export function getCompileArgs(target: Target): string[] {
  return target.chain?.override_std ? ['--override-std', target.chain.override_std] : [];
}

// The account `yarn account` created for the target network
export function getProfile(target: Target): Profile & { account: string } {
  const configPath = path.join(packageDir, `.${target.cli}`, 'config.yaml');
  const config = fs.existsSync(configPath) ? (yaml.load(fs.readFileSync(configPath, 'utf-8')) as Config) : undefined;
  const profile = config?.profiles?.[target.network];
  if (!profile?.account) {
    console.error(`No account for ${target.network}. Run \`yarn account --network ${target.network}\` first.`);
    process.exit(1);
  }
  return { ...profile, account: `0x${profile.account.replace(/^0x/, '')}` };
}

// Named addresses from the [addresses] section of Move.toml
export function getMoveTomlAddresses(): Record<string, string> {
  const toml = fs.readFileSync(path.join(packageDir, 'Move.toml'), 'utf-8');
  const section = toml.match(/^\[addresses\]([^[]*)/m);
  const addresses: Record<string, string> = {};
  for (const line of section?.[1].split('\n') ?? []) {
    const match = line.match(/^\s*(\w+)\s*=\s*['"]([^'"]*)['"]/);
    if (match) {
      addresses[match[1]] = match[2];
    }
  }
  return addresses;
}

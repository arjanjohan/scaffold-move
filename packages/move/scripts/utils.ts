import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';
import * as yaml from 'js-yaml';
import { Aptos, AptosConfig, Network, NetworkToNetworkName } from '@aptos-labs/ts-sdk';
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

// Oldest tested CLI versions. The Aptos framework branches need a recent aptos CLI to compile (9.4 fails on testnet).
const minCliVersion: Record<Cli, string> = { aptos: '9.6.0', movement: '7.4.0' };

function isOlderVersion(version: string, min: string): boolean {
  const [a, b] = [version, min].map(v => v.split('.').map(Number));
  const index = a.findIndex((part, i) => part !== b[i]);
  return index >= 0 && a[index] < b[index];
}

export function getTarget(network: string = defaultNetwork): Target {
  const chains: Record<string, Chain> = defaultChains;
  const chain: Chain | undefined = chains[network];
  if (!chain && network !== 'custom') {
    console.error(`Unknown network: ${network}. Use one of: ${Object.keys(chains).join(', ')}, custom`);
    process.exit(1);
  }
  return { network, chain, cli: chain?.cli ?? 'aptos' };
}

// Stop when the CLI for the target network is missing, warn when it is older than tested
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
  const number = version.split(' ')[1];
  if (isOlderVersion(number, minCliVersion[cli])) {
    console.warn(`Warning: ${cli} CLI ${number} is older than ${minCliVersion[cli]}, compiling may fail. See ${cliInstallUrls[cli]}`);
  }
}

// Runs the target's CLI in packages/move and exits when it fails.
// A quiet run returns the CLI output instead of printing it, and only prints it when the CLI fails.
export function runCli(target: Target, args: string[], options: { input?: string; quiet?: boolean } = {}): string {
  const { input, quiet } = options;
  if (!quiet) {
    console.log(`Executing: ${target.cli} ${args.join(' ')}`);
  }
  const result = spawnSync(target.cli, args, {
    cwd: packageDir,
    input,
    encoding: 'utf-8',
    stdio: [input === undefined ? 'inherit' : 'pipe', quiet ? 'pipe' : 'inherit', quiet ? 'pipe' : 'inherit'],
  });
  if (result.status !== 0) {
    if (quiet) {
      console.error(`${target.cli} ${args.join(' ')} failed:\n${result.stdout}${result.stderr}`);
    }
    process.exit(result.status ?? 1);
  }
  return quiet ? `${result.stdout}${result.stderr}` : '';
}

// Extra arguments to compile for the target network
export function getCompileArgs(target: Target): string[] {
  return target.chain?.override_std ? ['--override-std', target.chain.override_std] : [];
}

// The CLI profile for the target network, if `yarn account` created one
export function findProfile(target: Target): Profile | undefined {
  const configPath = path.join(packageDir, `.${target.cli}`, 'config.yaml');
  const config = fs.existsSync(configPath) ? (yaml.load(fs.readFileSync(configPath, 'utf-8')) as Config) : undefined;
  return config?.profiles?.[target.network];
}

// The account `yarn account` created for the target network
export function getProfile(target: Target): Profile & { account: string } {
  const profile = findProfile(target);
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

// SDK client for the target network. A `custom` target uses the REST URL of its CLI profile.
export function createClient(target: Target): Aptos {
  if (target.chain) {
    const network = NetworkToNetworkName[target.chain.network];
    // Custom chains need their URLs; Aptos networks (including local) use the SDK defaults
    return new Aptos(new AptosConfig({ network, fullnode: target.chain.fullnode, faucet: target.chain.faucet_api }));
  }
  return new Aptos(new AptosConfig({ network: Network.CUSTOM, fullnode: getProfile(target).rest_url }));
}

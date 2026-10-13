import * as fs from 'fs';
import { exec } from 'child_process';
import minimist from 'minimist';
import { defaultChains } from '@scaffold-move/common';
import { defaultNetwork } from '../move.config';
import { getConfigPath, getMoveTomlPath, parseYaml } from './utils';

const args = minimist(process.argv.slice(2));
const network = args.network || defaultNetwork; // Use default network from config if not provided
const chain = defaultChains[network];
const restUrl = args['rest-url'];
const faucetUrl = args['faucet-url'];
const moveTomlPath = getMoveTomlPath();
const configYamlPath = getConfigPath();

// Function to update the first address in the Move.toml file
function updateMoveTomlAddress(tomlPath: string, newAddress: string): void {
  let toml = fs.readFileSync(tomlPath, 'utf-8');
  const addressesSectionRegex = /\[addresses\]([\s\S]*?)(?=\[|$)/;
  const addressesMatch = toml.match(addressesSectionRegex);

  if (addressesMatch) {
    const addressesContent = addressesMatch[1].trim();
    if (addressesContent) {
      const firstAddressLine = addressesContent.split('\n')[0];
      const firstAddressKey = firstAddressLine.split('=')[0].trim();

      // Remove the current first address line
      const newAddressesContent = addressesContent.replace(firstAddressLine, `${firstAddressKey}='${newAddress}'`);
      toml = toml.replace(addressesMatch[1], `\n${newAddressesContent}\n`);
    } else {
      // If the section is present but empty
      toml = toml.replace('[addresses]', `[addresses]\naddr='${newAddress}'`);
    }
  } else {
    // Add [addresses] section if missing
    toml += `\n[addresses]\naddr='${newAddress}'\n`;
  }

  fs.writeFileSync(tomlPath, toml, 'utf-8');
  console.log(`Move.toml updated with new address: ${newAddress}`);
}

function initCustomNetwork(restUrl: string, faucetUrl?: string): void {
  let command = `[ ! -f .aptos/config.yaml ] || rm .aptos/config.yaml; echo '' | aptos init --network custom --rest-url ${restUrl}`;
  if (faucetUrl) {
    command += ` --faucet-url ${faucetUrl}`;
  }
  console.log(`Initializing custom network...`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(stdout);
      console.log(`Failed to initialize custom network. Please check your network settings.`);
      process.exit(1);
    }
    console.log(`Custom network initialized successfully.`);
    updateMoveTomlAfterInit();
    printFaucetUrl();
  });
}

function initPredefinedNetwork(network: string): void {
  const skipFaucet = network === 'testnet' ? ' --skip-faucet' : '';
  const command = `[ ! -f .aptos/config.yaml ] || rm .aptos/config.yaml; echo '' | aptos init --network ${network}${skipFaucet}`;
  console.log(`Initializing ${network} network...`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`Failed to initialize ${network} network. Please try again.`);
      process.exit(1);
    }
    console.log(`${network} network initialized successfully.`);
    updateMoveTomlAfterInit();
    printFaucetUrl();
  });
}

// Accounts are only funded by `aptos init` when a faucet API is known, otherwise point to the faucet page
function printFaucetUrl(): void {
  if (chain?.faucet_url && !chain.faucet_api) {
    console.log(`\nTo get test tokens for ${chain.name}, visit:`);
    console.log(chain.faucet_url);
  }
}

function updateMoveTomlAfterInit(): void {
  try {
    const config = parseYaml(configYamlPath);
    const newAddress = `0x${config.profiles.default.account?.replace(/^0x/, '') || ''}`; // Ensure 0x prefix
    updateMoveTomlAddress(moveTomlPath, newAddress);
  } catch (error) {
    console.log(`Failed to update Move.toml. Please check your configuration files.`);
  }
}

if (chain?.network === 'custom') {
  initCustomNetwork(chain.fullnode, chain.faucet_api);
} else if (chain) {
  initPredefinedNetwork(chain.network);
} else if (network === 'custom') {
  if (!restUrl) {
    console.log('Error: custom network requires --rest-url');
    process.exit(1);
  }
  initCustomNetwork(restUrl, faucetUrl);
} else {
  console.log(`Error: Unknown network: ${network}. Use one of: ${Object.keys(defaultChains).join(', ')}, custom`);
  process.exit(1);
}
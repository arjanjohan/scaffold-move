const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const minimist = require('minimist');
const { defaultNetwork, networks } = require('../move.config.ts'); // Import from move.config.ts

const args = minimist(process.argv.slice(2));
const network = args.network || defaultNetwork; // Use default network from config
const restUrl = args['rest-url'];
const faucetUrl = args['faucet-url'];
const moveTomlPath = path.join(__dirname, '../Move.toml');
const configYamlPath = path.join(__dirname, '../.aptos/config.yaml');

// Function to parse the YAML config file
function parseYaml(filePath) {
  const yamlContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(yamlContent);
}

// Function to update the first address in the Move.toml file
function updateMoveTomlAddress(tomlPath, newAddress) {
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

function initCustomNetwork(restUrl, faucetUrl) {
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
  });
}

function initPredefinedNetwork(network) {
  const command = `[ ! -f .aptos/config.yaml ] || rm .aptos/config.yaml; echo '' | aptos init --network ${network}`;
  console.log(`Initializing ${network} network...`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`Failed to initialize ${network} network. Please try again.`);
      process.exit(1);
    }
    console.log(`${network} network initialized successfully.`);
    updateMoveTomlAfterInit();
  });
}

function updateMoveTomlAfterInit() {
  try {
    const config = parseYaml(configYamlPath);
    const newAddress = `0x${config.profiles.default.account.replace(/^0x/, '')}`; // Ensure 0x prefix
    updateMoveTomlAddress(moveTomlPath, newAddress);
  } catch (error) {
    console.log(`Failed to update Move.toml. Please check your configuration files.`);
  }
}


if (network in networks) {
  const { 'rest-url': configRestUrl, 'faucet-url': configFaucetUrl } = networks[network];
  initCustomNetwork(configRestUrl, configFaucetUrl);
} else if (network === 'custom') {
  if (!restUrl) {
    console.log('Error: custom network requires --rest-url');
    process.exit(1);
  }
  initCustomNetwork(restUrl, faucetUrl);
} else if (["devnet", "testnet", "mainnet", "local"].includes(network)) {
  initPredefinedNetwork(network);
} else {
  console.log(`Error: Unknown network: ${network}`);
  process.exit(1);
}
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const { overrideMoveVersion } = require('../move.config.js');


function parseYaml(filePath) {
  const yamlContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(yamlContent);
}

async function main() {
  // Parse command line arguments
  const argv = minimist(process.argv.slice(2));

  // Read config to check network
  const configPath = path.join(__dirname, '../.aptos/config.yaml');
  const config = parseYaml(configPath);
  const network = config.profiles.default.network;
  const faucetUrl = config.profiles.default.faucet_url;

  // Determine if network is custom (localhost or custom URL)
  const isCustomNetwork = network.includes('Custom');

  // Build deploy command
  let deployCommand = 'aptos move publish';
  if (isCustomNetwork) {
    // Default to move-1 and bytecode-version 6 for custom networks, needed for deployment to Movement Bardock Testnet
    deployCommand += ' --move-1 --bytecode-version 6';
  } else if (overrideMoveVersion) {
    if (overrideMoveVersion === 'move-1') {
      deployCommand += ' --move-1';
    } else if (overrideMoveVersion === 'move-2') {
      deployCommand += ' --move-2';
    } else {
      throw new Error(`Invalid move version: ${overrideMoveVersion}`);
    }
  }

  // Add assume-yes flag
  deployCommand += ' --assume-yes';

  try {
    // Execute deploy command
    console.log(`Executing: ${deployCommand}`);
    execSync(deployCommand, { stdio: 'inherit' });

  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
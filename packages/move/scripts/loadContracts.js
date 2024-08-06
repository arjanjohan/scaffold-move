const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { AptosClient } = require('aptos'); // Assuming you're using the Aptos SDK for JavaScript

// Paths to the relevant files
const moveTomlPath = path.join(__dirname, '../Move.toml');
const configYamlPath = path.join(__dirname, '../.aptos/config.yaml');
const deployedModulesPath = path.join(__dirname, '../../../packages/nextjs/contracts/deployedModules.ts');
const externalModulesPath = path.join(__dirname, '../../../packages/nextjs/contracts/externalModules.ts');

// Function to parse the TOML file and extract addresses
function parseToml(filePath) {
  const toml = fs.readFileSync(filePath, 'utf-8');
  const addressesSection = toml.match(/\[addresses\]([\s\S]*?)(?=\[|$)/);
  if (addressesSection) {
    const addresses = {};
    const lines = addressesSection[1].trim().split('\n');
    lines.forEach(line => {
      const [key, value] = line.split('=').map(part => part.trim().replace(/['"]+/g, ''));
      addresses[key] = value.replace(/^0x/, ''); // Strip 0x from the address
    });
    return addresses;
  }
  return null;
}

// Function to parse the YAML config file
function parseYaml(filePath) {
  const yamlContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(yamlContent);
}

// Function to write modules to a TypeScript file
function writeModules(filePath, modules, network, variableName) {
  const moduleEntries = modules.map(module => {
    return `"${module.abi.name}": {
      "bytecode": ${JSON.stringify(module.bytecode)},
      "abi": ${JSON.stringify(module.abi)}
    }`;
  }).join(',\n');

  const output = `
import { GenericContractsDeclaration } from "~~/utils/scaffold-move/contract";

const ${variableName} = {
  "${network}": {
    ${moduleEntries}
  }
} as const;

export default ${variableName} satisfies GenericContractsDeclaration;
  `;

  fs.writeFileSync(filePath, output.trim(), 'utf-8');
}

// Function to fetch account modules
async function getAccountModules(requestParameters, nodeUrl) {
  const client = new AptosClient(nodeUrl);
  const { address, ledgerVersion } = requestParameters;
  let ledgerVersionBig;
  if (ledgerVersion !== undefined) {
    ledgerVersionBig = BigInt(ledgerVersion);
  }
  return client.getAccountModules(address, { ledgerVersion: ledgerVersionBig });
}

// Main function to perform the tasks
async function main() {
  const config = parseYaml(configYamlPath);
  const nodeUrl = config.profiles.default.rest_url;
  const accountAddress = config.profiles.default.account.replace(/^0x/, ''); // Strip 0x from the account address

  const addresses = parseToml(moveTomlPath);

  // Ensure the output directory exists
  const outputDirectory = path.dirname(deployedModulesPath);
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // Fetch and save account modules for the account from config.yaml
  const deployedModules = await getAccountModules({ address: accountAddress }, nodeUrl);
  writeModules(deployedModulesPath, deployedModules, "devnet", "deployedModules");
  console.log(`Data for deployed modules at address ${accountAddress} saved successfully.`);

  // Fetch and save account modules for each address from Move.toml, excluding the one from config.yaml
  if (addresses) {
    const externalModules = [];
    for (const [name, address] of Object.entries(addresses)) {
      if (address.toLowerCase() !== accountAddress.toLowerCase()) {
        const modules = await getAccountModules({ address }, nodeUrl);
        externalModules.push(...modules);
        console.log(`Data for address ${address} saved successfully.`);
      }
    }
    writeModules(externalModulesPath, externalModules, "devnet", "externalModules");
  } else {
    console.log('No addresses found in Move.toml.');
  }
}

main().catch(console.error);

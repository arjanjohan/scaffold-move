const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Paths to the relevant files
const moveTomlPath = path.join(__dirname, '../packages/move/Move.toml');
const configYamlPath = path.join(__dirname, '../packages/move/.aptos/config.yaml');

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

// Main function to perform the tasks
async function main() {
  const config = parseYaml(configYamlPath);
  const newAddress = `0x${config.profiles.default.account.replace(/^0x/, '')}`; // Ensure 0x prefix

  // Update the first address in Move.toml
  updateMoveTomlAddress(moveTomlPath, newAddress);
}

main().catch(console.error);

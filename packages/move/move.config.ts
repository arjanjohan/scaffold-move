
const defaultNetwork = 'testnet';

const networks = {
  movement_devnet: {
    'rest-url': 'https://devnet.m1.movementlabs.xyz/',
    'faucet-url': 'https://devnet.m1.movementlabs.xyz/',
  },
  movement_testnet: {
    'rest-url': 'https://aptos.testnet.suzuka.movementlabs.xyz/v1',
  },
  // Add any other networks you need here
};

// Set to false if external modules should not be loaded via script.
// If set to true, it will load modules from all addresses declared in move.toml.
const loadExternalModules = true;

module.exports = { defaultNetwork, networks, loadExternalModules };

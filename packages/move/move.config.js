 // Default network to use, currently set to Aptos Testnet
 // Create a new account with `yarn account` to change to the new default network
const defaultNetwork = 'movement_testnet';

const networks = {
  movement_devnet: {
    'rest-url': 'https://devnet.m1.movementlabs.xyz/',
    'faucet-url': 'https://devnet.m1.movementlabs.xyz/',
  },
  movement_testnet: {
    "rest-url": "https://aptos.testnet.bardock.movementlabs.xyz/v1",
  },
  movement_mainnet: {
    "rest-url": "https://mainnet.movementnetwork.xyz/v1"
  },
};

// Set to false if external modules should not be loaded via script.
// If set to true, it will load modules from all addresses declared in move.toml.
const loadExternalModules = true;

module.exports = { defaultNetwork, networks, loadExternalModules };


const defaultNetwork = 'testnet';

const networks = {
  movement_devnet: {
    'rest-url': 'https://devnet.m1.movementlabs.xyz/',
    'faucet-url': 'https://devnet.m1.movementlabs.xyz/',
  },
  movement_testnet: {
    "rest-url": "https://aptos.testnet.porto.movementlabs.xyz/v1"
  },
  // Old testnet for reference
  suzuka_testnet: {
    "rest-url": "https://aptos.testnet.suzuka.movementlabs.xyz/v1"
  },
  bardock_testnet: {
    "rest-url": "https://aptos.testnet.bardock.movementlabs.xyz/v1",
    // "faucet-url": "https://faucet.testnet.bardock.movementnetwork.xyz/",
  },
  movement_mainnet: {
    "rest-url": "https://mainnet.movementnetwork.xyz/v1"
  },
  // Add any other networks you need here
};

// Set to false if external modules should not be loaded via script.
// If set to true, it will load modules from all addresses declared in move.toml.
const loadExternalModules = true;

module.exports = { defaultNetwork, networks, loadExternalModules };

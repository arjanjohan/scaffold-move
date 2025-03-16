
const defaultNetwork = 'testnet';
// const overrideMoveVersion = 'move-1'; // Uncomment to use Move-1 for all networks

const networks = {
  movement_testnet: {
    "rest-url": "https://aptos.testnet.bardock.movementlabs.xyz/v1",
    // "faucet-url": "https://faucet.testnet.bardock.movementnetwork.xyz/",
  },
  movement_mainnet: {
    "rest-url": "https://mainnet.movementnetwork.xyz/v1"
  },
};

// Set to false if external modules should not be loaded via script.
// If set to true, it will load modules from all addresses declared in move.toml.
const loadExternalModules = true;

module.exports = { defaultNetwork, networks, loadExternalModules };

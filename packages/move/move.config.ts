interface NetworkConfig {
  "rest-url": string;
  "faucet-url"?: string;
}

interface Networks {
  [key: string]: NetworkConfig;
}

const defaultNetwork = 'movement_testnet';

const networks: Networks = {
  movement_testnet: {
    "rest-url": "https://testnet.bardock.movementnetwork.xyz/v1",
    // "faucet-url": "https://faucet.testnet.bardock.movementnetwork.xyz/",
  },
  movement_mainnet: {
    "rest-url": "https://mainnet.movementnetwork.xyz/v1"
  },
};

// Set to false if external modules should not be loaded via script.
// If set to true, it will load modules from all addresses declared in move.toml.
const loadExternalModules = true;

export { defaultNetwork, networks, loadExternalModules };
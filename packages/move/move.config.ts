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

module.exports = { defaultNetwork, networks };

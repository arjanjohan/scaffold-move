// Network used by `yarn account`, `yarn deploy`, `yarn compile` and `yarn test` when no --network is given.
// Must be a key of `defaultChains` in packages/common/chains.ts.
const defaultNetwork = 'movement_testnet';

// Set to false if external modules should not be loaded via script.
// If set to true, it will load modules from all addresses declared in move.toml.
const loadExternalModules = true;

export { defaultNetwork, loadExternalModules };

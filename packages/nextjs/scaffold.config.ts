import { Chain, defaultChains } from "@scaffold-move/common";

export type ScaffoldConfig = {
  // At least one network; the first one is used for module types and as the initial network
  targetNetworks: readonly [Chain, ...Chain[]];
};

const scaffoldConfig = {
  // The networks on which your DApp is live. Keep the first one in sync with `defaultNetwork` in
  // packages/move/move.config.ts, so the app starts on the network that `yarn deploy` deploys to.
  targetNetworks: [
    defaultChains.movement_testnet,
    defaultChains.aptos_testnet,
    // defaultChains.local, // needs `yarn chain`, see "Local network" in the README
  ],
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;

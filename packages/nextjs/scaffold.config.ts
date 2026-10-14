import { Chain, defaultChains } from "@scaffold-move/common";

export type ScaffoldConfig = {
  // At least one network; the first one is used for module types and as the initial network
  targetNetworks: readonly [Chain, ...Chain[]];
  allowAptosConnect: boolean;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [defaultChains.aptos_testnet, defaultChains.movement_testnet],

  // Allow Aptos Connect on the target networks
  allowAptosConnect: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;

import { Chain, defaultChains } from "./utils/scaffold-move/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly Chain[];
  pollingInterval: number;
  onlyLocalBurnerWallet: boolean;
  allowAptosConnect: boolean;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [defaultChains.aptos_testnet, defaultChains.movement_testnet],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  // Allow Aptos Connect on the target networks
  allowAptosConnect: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;

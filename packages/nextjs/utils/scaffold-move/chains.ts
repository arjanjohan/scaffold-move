import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export type Chain = {
  id: string;
  name: string;
  network: Network;
  fullnode?: string;
  indexer?: string;
  faucet?: string;
  block_explorer?: string;
};

type Chains = {
  [key: string]: Chain;
};

export const defaultChains: Chains = {
  movement_devnet: {
    id: "4",
    name: "Movement Devnet",
    network: Network.CUSTOM,
    fullnode: "https://aptos.devnet.m1.movementlabs.xyz",
    indexer: "https://indexer.devnet.m1.movementlabs.xyz/",
    faucet: "https://faucet2.movementlabs.xyz",
    block_explorer: "https://explorer.devnet.m1.movementlabs.xyz",
  },
  movement_testnet: {
    id: "27",
    name: "Movement Testnet",
    network: Network.CUSTOM,
    fullnode: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
    indexer: "https://indexer.testnet.m1.movementlabs.xyz/",
    faucet: "https://faucet.testnet.suzuka.movementlabs.xyz/",
    block_explorer: "https://explorer.movementnetwork.xyz",
  },
  aptos_mainnet: {
    id: "1",
    name: "Aptos Mainnet",
    network: Network.MAINNET,
  },
  aptos_testnet: {
    id: "2",
    name: "Aptos Testnet",
    network: Network.TESTNET,
  },
  aptos_devnet: {
    id: "65",
    name: "Aptos Devnet",
    network: Network.DEVNET,
  },
  local: {
    id: "4",
    name: "Local",
    network: Network.LOCAL,
  },
};

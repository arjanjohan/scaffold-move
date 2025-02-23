import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";

export type Chain = {
  id: number;
  name: string;
  network: Network;
  fullnode?: string;
  indexer?: string;
  faucet?: string;
  block_explorer?: string;
  explorer_network_param?: string;
  native_token_symbol?: string;
};

type Chains = {
  [key: string]: Chain;
};

export const defaultChains: Chains = {
  movement_devnet: {
    id: 4,
    name: "Movement Devnet",
    network: Network.CUSTOM,
    fullnode: "https://aptos.devnet.m1.movementlabs.xyz",
    indexer: "https://indexer.devnet.m1.movementlabs.xyz/",
    faucet: "https://faucet2.movementlabs.xyz",
    block_explorer: "https://explorer.devnet.m1.movementlabs.xyz",
    explorer_network_param: "devnet",
    native_token_symbol: "MOVE",
  },
  movement_testnet: {
    id: 250,
    name: "Movement Bardock Testnet",
    network: Network.CUSTOM,
    fullnode: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
    indexer: "",
    faucet: "https://faucet.testnet.bardock.movementnetwork.xyz/",
    block_explorer: "https://explorer.movementnetwork.xyz",
    explorer_network_param: "testnet",
    native_token_symbol: "MOVE",
  },
  movement_mainnet: {
    id: 126,
    name: "Movement Mainnet",
    network: Network.CUSTOM,
    fullnode: "https://mainnet.movementnetwork.xyz/v1",
    indexer: "",
    block_explorer: "https://explorer.movementnetwork.xyz",
    explorer_network_param: "mainnet",
    native_token_symbol: "MOVE",
  },
  aptos_mainnet: {
    id: NetworkToChainId[Network.MAINNET],
    name: "Aptos Mainnet",
    network: Network.MAINNET,
  },
  aptos_testnet: {
    id: NetworkToChainId[Network.TESTNET],
    name: "Aptos Testnet",
    network: Network.TESTNET,
  },
  aptos_devnet: {
    id: 149, // TODO: Hardcoded chainId for now, need to find a better solution
    name: "Aptos Devnet",
    network: Network.DEVNET,
  },
  local: {
    id: NetworkToChainId[Network.LOCAL],
    name: "Local",
    network: Network.LOCAL,
  },
};

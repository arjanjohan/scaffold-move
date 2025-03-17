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
  movement_testnet: {
    id: 250,
    name: "Movement Bardock Testnet",
    network: Network.CUSTOM,
    fullnode: "https://testnet.bardock.movementnetwork.xyz/v1",
    indexer: "https://indexer.testnet.movementnetwork.xyz",
    faucet: "https://faucet.movementnetwork.xyz/",
    block_explorer: "https://explorer.movementnetwork.xyz/",
    explorer_network_param: "bardock+testnet",
    native_token_symbol: "MOVE",
  },
  movement_mainnet: {
    id: 126,
    name: "Movement Mainnet",
    network: Network.CUSTOM,
    fullnode: "https://mainnet.movementnetwork.xyz/v1",
    indexer: "https://indexer.mainnet.movementnetwork.xyz/v1/graphql",
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
    faucet: "https://aptos.dev/en/network/faucet",
  },
  local: {
    id: NetworkToChainId[Network.LOCAL],
    name: "Local",
    network: Network.LOCAL,
  },
};

/**
 * Network definitions shared by the move scripts and the nextjs app.
 * Aptos networks only need `network`: the Aptos SDK and CLI know their endpoints.
 */

// Matches the values of the Aptos SDK `Network` enum
export type NetworkName = "mainnet" | "testnet" | "devnet" | "local" | "custom";

export type Chain = {
  id: number;
  name: string;
  indexer?: string;
  // Faucet API, used by the SDK and `aptos init`
  faucet_api?: string;
  // Faucet page, linked in the UI
  faucet_url?: string;
  block_explorer?: string;
  explorer_network_param?: string;
  native_token_symbol?: string;
} & (
  | { network: "custom"; fullnode: string }
  | { network: Exclude<NetworkName, "custom">; fullnode?: undefined }
);

// `as const` keeps chain ids literal, so the frontend can type modules per chain from scaffold.config
export const defaultChains = {
  movement_testnet: {
    id: 250,
    name: "Movement Testnet",
    network: "custom",
    fullnode: "https://testnet.movementnetwork.xyz/v1",
    indexer: "https://indexer.testnet.movementnetwork.xyz/v1/graphql",
    faucet_api: "https://faucet.testnet.movementnetwork.xyz",
    faucet_url: "https://faucet.movementnetwork.xyz",
    block_explorer: "https://explorer.movementnetwork.xyz",
    explorer_network_param: "testnet",
    native_token_symbol: "MOVE",
  },
  movement_mainnet: {
    id: 126,
    name: "Movement Mainnet",
    network: "custom",
    fullnode: "https://mainnet.movementnetwork.xyz/v1",
    indexer: "https://indexer.mainnet.movementnetwork.xyz/v1/graphql",
    block_explorer: "https://explorer.movementnetwork.xyz",
    explorer_network_param: "mainnet",
    native_token_symbol: "MOVE",
  },
  aptos_mainnet: {
    id: 1,
    name: "Aptos Mainnet",
    network: "mainnet",
    block_explorer: "https://explorer.aptoslabs.com",
    explorer_network_param: "mainnet",
  },
  aptos_testnet: {
    id: 2,
    name: "Aptos Testnet",
    network: "testnet",
    faucet_url: "https://aptos.dev/en/network/faucet",
    block_explorer: "https://explorer.aptoslabs.com",
    explorer_network_param: "testnet",
  },
  local: {
    id: 4,
    name: "Local",
    network: "local",
  },
} as const satisfies Record<string, Chain>;

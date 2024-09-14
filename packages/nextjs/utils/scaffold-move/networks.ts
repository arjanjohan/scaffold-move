import { Network } from "@aptos-labs/ts-sdk";
import scaffoldConfig from "~~/scaffold.config";
import { Chain } from "~~/utils/scaffold-move/chains";
import { defaultChains } from "~~/utils/scaffold-move/chains";

/**
 * Gives the block explorer transaction URL, returns empty string if the network is a local chain
 */
export function getBlockExplorerTxLink(chain: Chain, txnHash: string) {
  if (chain.network === Network.LOCAL) {
    return "";
  }

  const blockExplorerBaseURL = chain.block_explorer;

  // For non Aptos networks, use the configured block explorer
  if (blockExplorerBaseURL) {
    if (chain.id === defaultChains.movement_devnet.id) {
      return `${blockExplorerBaseURL}/txn/${txnHash}?network=devnet`;
    } else if (chain.id === defaultChains.movement_testnet.id) {
      return `${blockExplorerBaseURL}/txn/${txnHash}?network=testnet`;
    }
  }

  return `https://explorer.aptoslabs.com//txn/~${txnHash}?network=${chain.network}`;
}

/**
 * Gives the block explorer URL for a given address.
 * Defaults to Etherscan if no (wagmi) block explorer is configured for the network.
 */
export function getBlockExplorerAddressLink(chain: Chain, address: string) {
  if (chain.network === Network.LOCAL) {
    return "";
  }

  const blockExplorerBaseURL = chain.block_explorer;

  // For non Aptos networks, use the configured block explorer
  if (blockExplorerBaseURL) {
    if (chain.id === defaultChains.movement_devnet.id) {
      return `${blockExplorerBaseURL}/account/${address}?network=devnet`;
    } else if (chain.id === defaultChains.movement_testnet.id) {
      return `${blockExplorerBaseURL}/account/${address}?network=testnet`;
    }
  }

  return `https://explorer.aptoslabs.com/account/${address}?network=${chain.network}`;
}

/**
 * @returns targetNetworks array containing networks configured in scaffold.config including extra network metadata
 */
export function getTargetNetworks(): Chain[] {
  return scaffoldConfig.targetNetworks.map(targetNetwork => ({
    ...targetNetwork,
  }));
}

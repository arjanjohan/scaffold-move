import { Network } from "@aptos-labs/ts-sdk";
import scaffoldConfig from "~~/scaffold.config";
import { Chain } from "~~/utils/scaffold-move/chains";

/**
 * Gives the block explorer transaction URL, returns empty string if the network is a local chain
 */
export function getBlockExplorerTxLink(chain: Chain, txnHash: string) {
  return buildExplorerUrl(chain, "txn", txnHash);
}

/**
 * Gives the block explorer URL for a given address.
 * Defaults to Aptoslabs explorer if no block explorer is configured for the network.
 */
export function getBlockExplorerAddressLink(chain: Chain, address: string) {
  return buildExplorerUrl(chain, "account", address);
}

function buildExplorerUrl(chain: Chain, path: string, param: string) {
  if (chain.network === Network.LOCAL) {
    return "";
  }

  if (chain.block_explorer) {
    const networkParam = chain.explorer_network_param ? `?network=${chain.explorer_network_param}` : "";
    return `${chain.block_explorer}/${path}/${param}${networkParam}`;
  }

  return `https://explorer.aptoslabs.com/${path}/${param}?network=${chain.network}`;
}

/**
 * @returns targetNetworks array containing networks configured in scaffold.config including extra network metadata
 */
export function getTargetNetworks(): Chain[] {
  return scaffoldConfig.targetNetworks.map(targetNetwork => ({
    ...targetNetwork,
  }));
}

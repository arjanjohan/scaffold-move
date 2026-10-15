import { Chain } from "@scaffold-move/common";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Gives the block explorer transaction URL, returns empty string if the network has no block explorer
 */
export function getBlockExplorerTxLink(chain: Chain, txnHash: string) {
  return buildExplorerUrl(chain, "txn", txnHash);
}

/**
 * Gives the block explorer URL for a given address, returns empty string if the network has no block explorer
 */
export function getBlockExplorerAddressLink(chain: Chain, address: string) {
  return buildExplorerUrl(chain, "account", address);
}

function buildExplorerUrl(chain: Chain, path: string, param: string) {
  if (!chain.block_explorer) {
    return "";
  }

  const networkParam = chain.explorer_network_param ? `?network=${chain.explorer_network_param}` : "";
  return `${chain.block_explorer}/${path}/${param}${networkParam}`;
}

/**
 * @returns targetNetworks array containing networks configured in scaffold.config including extra network metadata
 */
export function getTargetNetworks(): Chain[] {
  return scaffoldConfig.targetNetworks.map(targetNetwork => ({
    ...targetNetwork,
  }));
}

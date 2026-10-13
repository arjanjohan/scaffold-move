import { useMemo } from "react";
import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { Chain, defaultChains } from "@scaffold-move/common";

// Aptos Labs API key, only sent to Aptos networks
const aptosApiKey = process.env.NEXT_PUBLIC_APTOS_API_KEY;

export function useAptosClient(chainId: number) {
  // Reuse the client per chain, hooks that depend on it would otherwise refetch on every render
  return useMemo(() => {
    const chain = Object.values<Chain>(defaultChains).find(chain => chain.id === chainId);
    if (!chain) {
      throw new Error(`Chain with id ${chainId} not found`);
    }

    const aptosConfig = new AptosConfig({
      network: NetworkToNetworkName[chain.network],
      ...(chain.network === "custom"
        ? { fullnode: chain.fullnode, indexer: chain.indexer, faucet: chain.faucet_api }
        : { clientConfig: { API_KEY: aptosApiKey } }),
    });
    return new Aptos(aptosConfig);
  }, [chainId]);
}

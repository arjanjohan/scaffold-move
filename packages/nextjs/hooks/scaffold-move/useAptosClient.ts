import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { defaultChains } from "@scaffold-move/common";

const aptosApiKey = process.env.NEXT_PUBLIC_APTOS_API_KEY;

export function useAptosClient(chainId: number) {
  const chain = Object.values(defaultChains).find(chain => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }

  const aptosConfig = new AptosConfig({
    network: NetworkToNetworkName[chain.network],
    ...(chain.network === "custom" && {
      fullnode: chain.fullnode,
      indexer: chain.indexer,
      faucet: chain.faucet,
    }),
    ...(aptosApiKey && {
      apiKey: aptosApiKey,
    }),
  });
  return new Aptos(aptosConfig);
}

import { defaultChains } from "../../utils/scaffold-move/chains";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export function useAptosClient(chainId: number) {
  const chain = Object.values(defaultChains).find(chain => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }

  const aptosConfig = new AptosConfig({
    network: chain.network,
    ...(chain.network === Network.CUSTOM && {
      fullnode: chain.fullnode,
      indexer: chain.indexer,
      faucet: chain.faucet,
    }),
  });
  return new Aptos(aptosConfig);
}

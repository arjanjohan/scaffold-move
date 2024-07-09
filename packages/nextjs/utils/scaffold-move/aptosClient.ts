import { defaultChains } from "./chains";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export function aptosClient(chainId: string) {
  const chain = defaultChains[chainId];
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

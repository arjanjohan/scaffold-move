import { useAptosClient } from "../scaffold-move/useAptosClient";
import { useTargetNetwork } from "../scaffold-move/useTargetNetwork";
import { useGetIpfsMetadata } from "./useGetIpfsMetadata";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { Tokens_Select_Column } from "aptos";
import { getIpfsHash } from "~~/utils/nft-minting/ipfsUploader";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

export interface NftDetails {
  collection_address: string;
  token_address: string;
  token_uri: string;
  item_name: string;
  attributes: any[];
}

export function useGetOwnedNfts(collectionAddress?: string, accountAddress?: string) {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);

  if (!accountAddress) {
    const { account: connectedAccount } = useWallet();
    accountAddress = connectedAccount?.address;
  }

  // TODO: allow multiple collection addresses?

  return useQuery({
    queryKey: ["ownedNfts", collectionAddress, accountAddress],
    queryFn: async () => {
      if (!accountAddress) return [];
      const tokens = (await aptosClient.getAccountOwnedTokens({ accountAddress })) as any[];
      if (collectionAddress) {
        return tokens.filter((token: any) => token.collection.collection_id === collectionAddress);
      }

      if (tokens.length === 0) {
        return [];
      }
      return tokens;
    },
    enabled: !!accountAddress,
  });
}

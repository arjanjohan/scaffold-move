import { ResponseError, withResponseError } from "../client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getIpfsMetadata } from "~~/utils/nft-minting/ipfsUploader";

export function useGetIpfsMetadata<T = any>(ipfsHash: string): UseQueryResult<T, ResponseError> {
  return useQuery({
    queryKey: ["metadata", { ipfsHash }],
    queryFn: async () => {
      try {
        const metadata = await getIpfsMetadata(ipfsHash);
        return metadata;
      } catch (error) {
        console.error("Error fetching metadata:", error);
        return null;
      }
    },
  });
}

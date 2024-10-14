import { ResponseError } from "../client";
import { useAptosClient } from "./useAptosClient";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const getANS = (address: string, client: Aptos): Promise<string | undefined> => {
  return client.getPrimaryName({ address });
};

export const useGetANS = (address?: string): UseQueryResult<string | undefined, ResponseError> => {
  const network = useTargetNetwork();
  const { account } = useWallet();

  console.log("useGetANS", address);

  const aptosClient = useAptosClient(network.targetNetwork.id);

  const targetAddress = address || account?.address;

  return useQuery<string | undefined, ResponseError>({
    queryKey: ["ANS", targetAddress],
    queryFn: async () => {
      if (!targetAddress) return undefined;
      return getANS(targetAddress, aptosClient);
    },
    enabled: !!targetAddress,
  });
};

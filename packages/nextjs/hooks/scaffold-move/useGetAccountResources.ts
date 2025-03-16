import { ResponseError, withResponseError } from "../client";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";

export function getAccountResources(
  requestParameters: { address: string; ledgerVersion?: number },
  client: Aptos,
): Promise<Types.MoveResource[]> {
  const { address, ledgerVersion } = requestParameters;
  let ledgerVersionBig;
  if (ledgerVersion !== undefined) {
    ledgerVersionBig = BigInt(ledgerVersion);
  }
  return withResponseError(
    client.getAccountResources({ accountAddress: address, options: { ledgerVersion: ledgerVersionBig } }),
  );
}

export function useGetAccountResources(
  address?: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource[], ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const { account } = useWallet();

  // If address is not provided, use the wallet address
  // Default to empty string if account is not connected
  // Empty string will lead to ResponseError
  const resourceAddress = address || account?.address?.toString() || "";

  return useQuery<Array<Types.MoveResource>, ResponseError>({
    queryKey: ["accountResources", { address: resourceAddress }],
    queryFn: () => getAccountResources({ address: resourceAddress }, aptosClient),
    retry: options?.retry ?? false,
  });
}

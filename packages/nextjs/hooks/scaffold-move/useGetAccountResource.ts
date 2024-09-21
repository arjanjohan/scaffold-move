import { ResponseError, withResponseError } from "../client";
import { useGetModule } from "./useGetModule";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";

export function getAccountResource(
  requestParameters: {
    address: string;
    moduleAddress: string;
    moduleName: string;
    resourceName: string;
    ledgerVersion?: number;
  },
  client: Aptos,
): Promise<Types.MoveResource> {
  const { address, moduleAddress, moduleName, resourceName, ledgerVersion } = requestParameters;

  const resourceType: `${string}::${string}::${string}` = `${moduleAddress}::${moduleName}::${resourceName}`;
  let ledgerVersionBig;
  if (ledgerVersion !== undefined) {
    ledgerVersionBig = BigInt(ledgerVersion);
  }
  return withResponseError(
    client.getAccountResource({ accountAddress: address, resourceType, options: { ledgerVersion: ledgerVersionBig } }),
  );
}

export function useGetAccountResource(
  moduleName: string,
  resourceName: string,
  address?: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource, ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const moduleAddress = useGetModule(moduleName)?.abi.address ?? "";
  const { account } = useWallet();

  // If address is not provided, use the wallet address
  // Default to empty string if account is not connected
  // Empty string will lead to ResponseError
  const resourceAddress = address || account?.address || "";

  return useQuery<Types.MoveResource, ResponseError>({
    queryKey: ["accountResource", { address: resourceAddress, moduleAddress, moduleName, resourceName }],
    queryFn: () =>
      getAccountResource({ address: resourceAddress, moduleAddress, moduleName, resourceName }, aptosClient),
    retry: options?.retry ?? false,
  });
}

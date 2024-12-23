import { ResponseError, withResponseError } from "../client";
import { useGetModule } from "./useGetModule";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useAptosClient } from "~~/hooks/scaffold-move";

export function getAccountResource<T = any>(
  requestParameters: {
    address: string;
    moduleAddress: string;
    moduleName: string;
    resourceName: string;
    ledgerVersion?: number;
  },
  client: Aptos,
): Promise<T> {
  const { address, moduleAddress, moduleName, resourceName, ledgerVersion } = requestParameters;

  const resourceType: `${string}::${string}::${string}` = `${moduleAddress}::${moduleName}::${resourceName}`;
  let ledgerVersionBig;
  if (ledgerVersion !== undefined) {
    ledgerVersionBig = BigInt(ledgerVersion);
  }
  return withResponseError(
    client.getAccountResource({ accountAddress: address, resourceType, options: { ledgerVersion: ledgerVersionBig } }),
  ).then(result => result as unknown as T);
}

export function useGetAccountResource<T = any>(
  moduleName: string,
  resourceName: string,
  externalModuleAddress?: string,
  address?: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<T, ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const moduleAddress = externalModuleAddress ? externalModuleAddress : useGetModule(moduleName)?.abi.address;
  const { account } = useWallet();

  // If address is not provided, use the wallet address
  // Default to empty string if account is not connected
  const resourceAddress = address || account?.address || "";

  return useQuery<T, ResponseError>({
    queryKey: ["accountResource", { address: resourceAddress, moduleAddress, moduleName, resourceName }],
    queryFn: () => {
      if (!moduleAddress) {
        throw new Error(`Module address not found for module: ${moduleName}`);
      }
      return getAccountResource({ address: resourceAddress, moduleAddress, moduleName, resourceName }, aptosClient);
    },
    retry: options?.retry ?? false,
  });
}

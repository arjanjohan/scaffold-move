import { ResponseError, withResponseError } from "../client";
import { useGetModule } from "./useGetModule";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
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
): Promise<Types.MoveResource[]> {
  const { address, moduleAddress, moduleName, resourceName } = requestParameters;

  const resourceType: `${string}::${string}::${string}` = `${moduleAddress}::${moduleName}::${resourceName}`;
  // let ledgerVersionBig;
  // if (ledgerVersion !== undefined) {
  //   ledgerVersionBig = BigInt(ledgerVersion);
  // }
  return withResponseError(client.getAccountResource({ accountAddress: address, resourceType }));
}

export function useGetAccountResource(
  address: string,
  moduleName: string,
  resourceName: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource[], ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const moduleAddress = useGetModule(moduleName)?.abi.address ?? "";

  const test = useQuery<Array<Types.MoveResource>, ResponseError>({
    queryKey: ["accountResource", { address, moduleAddress, moduleName, resourceName }],
    queryFn: () => getAccountResource({ address, moduleAddress, moduleName, resourceName }, aptosClient),
    retry: options?.retry ?? false,
  });
  return test;
}

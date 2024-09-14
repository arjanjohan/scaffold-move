import { ResponseError, withResponseError } from "../client";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";

export function getAccountResource(
  requestParameters: { address: string; resourceType: `${string}::${string}::${string}`, 
    ledgerVersion?: number },
  client: Aptos,
): Promise<Types.MoveResource[]> {
  const { address, ledgerVersion } = requestParameters;
  // let ledgerVersionBig;
  // if (ledgerVersion !== undefined) {
  //   ledgerVersionBig = BigInt(ledgerVersion);
  // }
  return withResponseError(client.getAccountResource({ accountAddress: address, resourceType: requestParameters.resourceType }));  
}

export function useGetAccountResource(
  address: string,
  resourceType: `${string}::${string}::${string}`,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource[], ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);

  const test = useQuery<Array<Types.MoveResource>, ResponseError>({
    queryKey: ["accountResource", { address, resourceType }],
    queryFn: () => getAccountResource({ address, resourceType }, aptosClient),
    retry: options?.retry ?? false,
  });
  return test;
}

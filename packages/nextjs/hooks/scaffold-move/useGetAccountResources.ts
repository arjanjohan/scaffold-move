import { ResponseError, withResponseError } from "../client";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
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
  return withResponseError(client.getAccountResources({ accountAddress: address }));
}

export function useGetAccountResources(
  address: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource[], ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);

  const test = useQuery<Array<Types.MoveResource>, ResponseError>({
    queryKey: ["accountResources", { address }],
    queryFn: () => getAccountResources({ address }, aptosClient),
    retry: options?.retry ?? false,
  });
  return test;
}

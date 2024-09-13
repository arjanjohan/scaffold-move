import { ResponseError, withResponseError } from "../client";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";

export function getAccountModule(
  requestParameters: {
    accountAddress: string;
    moduleName: string;
    ledgerVersion?: number;
  },
  client: Aptos,
): Promise<Types.MoveModuleBytecode> {
  const { accountAddress, moduleName, ledgerVersion } = requestParameters;
  let ledgerVersionBig;
  if (ledgerVersion !== undefined) {
    ledgerVersionBig = BigInt(ledgerVersion);
  }
  return withResponseError(client.getAccountModule({ accountAddress, moduleName }));
}

export function useGetAccountModule(
  address: string,
  moduleName: string,
): UseQueryResult<Types.MoveModuleBytecode, ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);

  return useQuery<Types.MoveModuleBytecode, ResponseError>({
    queryKey: ["accountModule", { address, moduleName }],
    queryFn: () => getAccountModule({ accountAddress: address, moduleName }, aptosClient),
  });
}

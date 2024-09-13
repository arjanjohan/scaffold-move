import { ResponseError, withResponseError } from "../client";
import { useTargetNetwork } from "./useTargetNetwork";
import { Aptos } from "@aptos-labs/ts-sdk";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";

function getAccountModules(
  requestParameters: { address: string; ledgerVersion?: number },
  client: Aptos,
): Promise<Types.MoveModuleBytecode[]> {
  const { address, ledgerVersion } = requestParameters;
  let ledgerVersionBig;
  if (ledgerVersion !== undefined) {
    ledgerVersionBig = BigInt(ledgerVersion);
  }
  return withResponseError(client.getAccountModules({ accountAddress: address }));
}

export function useGetAccountModules(address: string): UseQueryResult<Types.MoveModuleBytecode[], ResponseError> {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  console.log("useGetAccountModules", address);

  return useQuery<Array<Types.MoveModuleBytecode>, ResponseError>({
    queryKey: ["accountModules", { address }],
    queryFn: () => getAccountModules({ address }, aptosClient),
  });
}

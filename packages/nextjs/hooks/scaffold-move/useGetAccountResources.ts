import { getAccountResources } from "..";
import { ResponseError } from "../client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useTargetNetwork } from "./useTargetNetwork";

export function useGetAccountResources(
  address: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource[], ResponseError> {

  const network = useTargetNetwork();
  let state = {network_value: ""};
  // if (network.targetNetwork.network === Network.CUSTOM) {
  state.network_value = network.targetNetwork.fullnode ? network.targetNetwork.fullnode : "" ;
  // } else {

  // }

  const test = useQuery<Array<Types.MoveResource>, ResponseError>({
    queryKey: ["accountResources", { address }, state.network_value],
    queryFn: () => getAccountResources({ address }, state.network_value),
    retry: options?.retry ?? false,
  });
  return test;
}

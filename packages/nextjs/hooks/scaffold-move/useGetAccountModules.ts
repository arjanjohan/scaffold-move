import { getAccountModules } from "..";
import { ResponseError } from "../client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";
import { useTargetNetwork } from "./useTargetNetwork";

export function useGetAccountModules(address: string): UseQueryResult<Types.MoveModuleBytecode[], ResponseError> {

  const network = useTargetNetwork();
  let state = {network_value: ""};
  // if (network.targetNetwork.network === Network.CUSTOM) {
  state.network_value = network.targetNetwork.fullnode ? network.targetNetwork.fullnode : "" ;
  // } else {

  // }

  return useQuery<Array<Types.MoveModuleBytecode>, ResponseError>({
    queryKey: ["accountModules", { address }, state.network_value],
    queryFn: () => getAccountModules({ address }, state.network_value),
  });
}

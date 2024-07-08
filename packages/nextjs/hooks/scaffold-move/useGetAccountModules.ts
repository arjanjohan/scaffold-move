import {Types} from "aptos";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getAccountModules} from "..";
import {ResponseError} from "../client";
// import {useGlobalState} from "../../global-config/GlobalConfig";

export function useGetAccountModules(
  address: string,
): UseQueryResult<Types.MoveModuleBytecode[], ResponseError> {
  // const [state] = useGlobalState();
  const state = {network_value: "https://aptos.devnet.m1.movementlabs.xyz"}


  return useQuery<Array<Types.MoveModuleBytecode>, ResponseError>({
    queryKey: ["accountModules", {address}, state.network_value],
    queryFn: () => getAccountModules({address}, state.network_value),
  });
}

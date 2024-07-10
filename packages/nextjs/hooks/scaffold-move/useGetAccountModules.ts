import { getAccountModules } from "..";
import { ResponseError } from "../client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Types } from "aptos";


export function useGetAccountModules(address: string): UseQueryResult<Types.MoveModuleBytecode[], ResponseError> {
  const state = { network_value: "https://aptos.devnet.m1.movementlabs.xyz" };

  return useQuery<Array<Types.MoveModuleBytecode>, ResponseError>({
    queryKey: ["accountModules", { address }, state.network_value],
    queryFn: () => getAccountModules({ address }, state.network_value),
  });
}

import {Types} from "aptos";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getAccountResources} from "..";
import {ResponseError} from "../client";
import {useGlobalState} from "../../global-config/GlobalConfig";

export function useGetAccountResources(
  address: string,
  options?: {
    retry?: number | boolean;
  },
): UseQueryResult<Types.MoveResource[], ResponseError> {
  const [state] = useGlobalState();
  const test = useQuery<Array<Types.MoveResource>, ResponseError>({
    queryKey: ["accountResources", {address}, state.network_value],
    queryFn: () => getAccountResources({address}, state.network_value),
    retry: options?.retry ?? false,
  });
  return test;
}

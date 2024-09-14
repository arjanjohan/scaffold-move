import { Aptos } from "@aptos-labs/ts-sdk";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "./useTargetNetwork";

export type ViewArguments = {
  module_address: string;
  module_name: string;
  function_name: string;
  ty_args?: string[];
  function_args?: string[];
};

export const useView = async (request: ViewArguments): Promise<Types.MoveValue[]> => {
  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);

  const viewResult = await aptos.view({
    payload: {
      function: `${request.module_address}::${request.module_name}::${request.function_name}`,
      typeArguments: request.ty_args || [],
      functionArguments: request.function_args || [],
    },
  });

  return viewResult;
};

import { Aptos } from "@aptos-labs/ts-sdk";

export type ViewArguments = {
  module_address: string;
  module_name: string;
  function_name: string;
  ty_args?: string[];
  function_args?: string[];
};

export const view = async (request: ViewArguments, aptos: Aptos): Promise<any[]> => {
  const viewResult = await aptos.view({
    payload: {
      function: `${request.module_address}::${request.module_name}::${request.function_name}`,
      typeArguments: request.ty_args || [],
      functionArguments: request.function_args || [],
    },
  });

  return viewResult;
};

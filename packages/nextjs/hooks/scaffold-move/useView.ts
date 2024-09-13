import { useTargetNetwork } from "./useTargetNetwork";
import { Types } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move";

export type AccountNativeBalanceArguments = {
  module_address: string;
  module_name: string;
  function_name: string;
  ty_args: string[];
  address: Types.Address;
};

// TODO: incomplete and untested
export const useView = async (args: AccountNativeBalanceArguments): Promise<[any]> => {
  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);

  const { module_address, module_name, function_name, ty_args, address } = args;
  const viewResult = await aptos.view<[any]>({
    payload: {
      function: `${module_address}::${module_name}::${function_name}`,
      typeArguments: ty_args,
      functionArguments: [address],
    },
  });
  return await viewResult;
};

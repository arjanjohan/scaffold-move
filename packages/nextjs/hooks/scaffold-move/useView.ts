import { useCallback, useEffect, useState } from "react";
import { useGetModule } from "./useGetModule";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { processArguments } from "~~/utils/scaffold-move/arguments";
import { ModuleName, ModuleViewFunctionNames, ModuleViewFunctions } from "~~/utils/scaffold-move/module";

export type ViewArguments = {
  module_address: string;
  module_name: string;
  function_name: string;
  ty_args: string[];
  function_args: string[];
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

export type UseViewConfig<
  TModuleName extends ModuleName,
  TFunctionName extends ModuleViewFunctionNames<TModuleName>,
> = {
  moduleName: TModuleName;
  functionName: TFunctionName;
} & (ModuleViewFunctions<TModuleName>[TFunctionName]["args"] extends []
  ? { args?: never }
  : { args: ModuleViewFunctions<TModuleName>[TFunctionName]["args"] }) &
  (ModuleViewFunctions<TModuleName>[TFunctionName]["tyArgs"] extends []
    ? { tyArgs?: never }
    : { tyArgs: ModuleViewFunctions<TModuleName>[TFunctionName]["tyArgs"] }) & {
    watch?: boolean;
  };

export const useView = <TModuleName extends ModuleName, TFunctionName extends ModuleViewFunctionNames<TModuleName>>({
  moduleName,
  functionName,
  args,
  tyArgs,
  watch = false,
}: UseViewConfig<TModuleName, TFunctionName>) => {
  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);
  const [data, setData] = useState<ModuleViewFunctions<TModuleName>[TFunctionName]["returns"] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Undefined when the module isn't deployed on the target network
  const moduleAddress = useGetModule(moduleName.toString())?.abi.address;

  // Memoize args to avoid stringifying in the dependency array
  const argsString = JSON.stringify(args);

  const fetchData = useCallback(async () => {
    if (!moduleAddress) {
      // Clear data from a previous network where the module was deployed
      setData(null);
      setError(new Error(`Module ${moduleName.toString()} is not deployed on ${network.targetNetwork.name}`));
      return;
    }
    if (args && args.some((arg: any) => arg === undefined)) {
      // e.g. no connected account yet; don't keep showing the result for earlier arguments
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: ViewArguments = {
        module_address: moduleAddress,
        module_name: moduleName.toString(),
        function_name: functionName.toString(),
        ty_args: tyArgs || [],
        function_args: processArguments(args || []),
      };

      const result = await view(request, aptos);
      setData(result);
    } catch (err) {
      console.log("error: ", err);
      // Don't keep showing the result for earlier arguments, e.g. another account's
      setData(null);
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [moduleAddress, moduleName, functionName, tyArgs, argsString, aptos, network.targetNetwork.name]);

  useEffect(() => {
    fetchData();

    if (watch) {
      const interval = setInterval(fetchData, 10000); // Adjust the interval as needed
      return () => clearInterval(interval);
    }
  }, [fetchData, watch]);

  return { data, error, isLoading, refetch: fetchData };
};

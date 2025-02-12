import { useEffect, useState } from "react";
import { useGetModule } from "./useGetModule";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { ModuleName, ChainModules, ModuleViewFunctionNames, ModuleViewFunctions } from "~~/utils/scaffold-move/module";

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

export type UseViewConfig<
  TModuleName extends keyof ChainModules,
  TFunctionName extends ModuleViewFunctionNames<TModuleName>
> = {
  moduleName: TModuleName;
  functionName: TFunctionName;
  args: ModuleViewFunctions<TModuleName>[TFunctionName]["args"];
  tyArgs?: string[];
  watch?: boolean;
};



export const useView = <
  TModuleName extends keyof ChainModules,
  TFunctionName extends ModuleViewFunctionNames<TModuleName>
>({
  moduleName,
  functionName,
  args,
  tyArgs = [],
  watch = false,
}: UseViewConfig<TModuleName, TFunctionName>) => {
  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const moveModule = useGetModule(moduleName.toString());
  if (!moveModule) {
    throw new Error("Module not found");
  }

  const moduleAddress = moveModule.abi.address;

  const fetchData = async () => {
    if (args.some(arg => arg === undefined)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: ViewArguments = {
        module_address: moduleAddress,
        module_name: moduleName.toString(),
        function_name: functionName.toString(),
        ty_args: tyArgs,
        function_args: Array.from(args).map(arg => String(arg)),
      };
      console.log("request", request);
      const result = await view(request, aptos);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (watch) {
      const interval = setInterval(fetchData, 10000); // Adjust the interval as needed
      return () => clearInterval(interval);
    }
  }, [moduleName, functionName, JSON.stringify(args), JSON.stringify(tyArgs), watch]);

  return { data, error, isLoading, refetch: fetchData };
};

import { useDeployedModuleInfo } from "~~/hooks/scaffold-move";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";

/**
 * Gets an instance of the module present in deployedModules.ts or externalModules.ts corresponding to
 * targetNetworks configured in scaffold.config.ts. Optional walletClient can be passed for doing write transactions.
 * @param config - The config settings for the hook
 * @param config.moduleName - deployed module name
 */
export const useScaffoldModule = <TModuleName extends string>({
  moduleName: moduleName,
}: {
  moduleName: TModuleName;
}) => {
  const { data: deployedModuleData, isLoading: deployedModuleLoading } = useDeployedModuleInfo(moduleName);
  const { targetNetwork } = useTargetNetwork();
  const aptos = useAptosClient(targetNetwork.id);

  let module = undefined;
  if (!deployedModuleLoading && deployedModuleData && aptos) {
    // TODO: unfinished
  }
  return module;
};

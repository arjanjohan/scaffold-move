import { useEffect, useState } from "react";
import { getAccountModule } from "./useGetAccountModule";
import { useIsMounted } from "usehooks-ts";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { Module, ModuleCodeStatus, ModuleName, modules } from "~~/utils/scaffold-move/module";

/**
 * Gets the matching module info for the provided module name from the modules present in deployedModules.ts
 * and externalModules.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedModuleInfo = <TModuleName extends ModuleName>(moduleName: TModuleName) => {
  const isMounted = useIsMounted();
  const { targetNetwork } = useTargetNetwork();
  const aptos = useAptosClient(targetNetwork.id);

  const deployedModules = modules?.[targetNetwork.id]?.[moduleName.toString()] as Module<TModuleName>;
  const [status, setStatus] = useState<ModuleCodeStatus>(ModuleCodeStatus.LOADING);

  useEffect(() => {
    const checkModuleDeployment = async () => {
      try {
        if (!isMounted() || !aptos) return;

        if (!deployedModules) {
          setStatus(ModuleCodeStatus.NOT_FOUND);
          return;
        }
        const accountModule = getAccountModule(
          { accountAddress: deployedModules.abi.address, moduleName: moduleName.toString() },
          aptos,
        );
        // If module code is `0x` => no module deployed on that address
        if ((await accountModule).bytecode === "0x") {
          setStatus(ModuleCodeStatus.NOT_FOUND);
          return;
        }

        setStatus(ModuleCodeStatus.DEPLOYED);
      } catch (e) {
        console.error(e);
        setStatus(ModuleCodeStatus.NOT_FOUND);
      }
    };

    checkModuleDeployment();
  }, [isMounted, moduleName, deployedModules]);

  return {
    data: status === ModuleCodeStatus.DEPLOYED ? deployedModules : undefined,
    isLoading: status === ModuleCodeStatus.LOADING,
  };
};

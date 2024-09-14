import { useEffect, useState } from "react";
import { getAccountModule } from "./useGetAccountModule";
import { useIsMounted } from "usehooks-ts";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-move/module";

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedModules.ts
 * and externalModules.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedModuleInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const isMounted = useIsMounted();
  const { targetNetwork } = useTargetNetwork();
  const aptos = useAptosClient(targetNetwork.id);

  const deployedModules = contracts?.[targetNetwork.id]?.[contractName.toString()] as Contract<TContractName>;
  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);

  useEffect(() => {
    const checkContractDeployment = async () => {
      try {
        if (!isMounted() || !aptos) return;

        if (!deployedModules) {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }
        const accountModule = getAccountModule({ accountAddress: deployedModules.abi.address, moduleName: contractName.toString() }, aptos);
        // If contract code is `0x` => no contract deployed on that address
        if ((await accountModule).bytecode === "0x") {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }

        setStatus(ContractCodeStatus.DEPLOYED);
      } catch (e) {
        console.error(e);
        setStatus(ContractCodeStatus.NOT_FOUND);
      }
    };

    checkContractDeployment();
  }, [isMounted, contractName, deployedModules]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedModules : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
  };
};

import { useEffect, useState } from "react";
import { getAccountModule } from "./useGetAccountModule";
import { useIsMounted } from "usehooks-ts";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-move/contract";

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

        // // Check if contract is deployed on the network
        getAccountModule({ accountAddress: deployedModules.address, moduleName: contractName.toString() }, aptos);

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

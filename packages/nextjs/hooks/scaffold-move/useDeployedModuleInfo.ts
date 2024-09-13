import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-move/contract";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { getAccountModule } from "./useGetAccountModule";


/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedModules.ts
 * and externalModules.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedModuleInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const isMounted = useIsMounted();
  const { targetNetwork } = useTargetNetwork();
  const aptos = useAptosClient(targetNetwork.id);
  
  // TODO: what is contract or network is not there?
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
        getAccountModule({ address: deployedModules.address,
          moduleName: contractName.toString()
         }, aptos);

        // const code = await publicClient.getBytecode({
        //   address: deployedContract.address,
        // });

        // // If contract code is `0x` => no contract deployed on that address
        // if (code === "0x") {
        //   setStatus(ContractCodeStatus.NOT_FOUND);
        //   return;
        // }
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

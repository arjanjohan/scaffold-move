import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-move/contract";

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedContracts.ts
 * and externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedContractInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const isMounted = useIsMounted();
  const targetNetwork = "devnet";
  const deployedContract = contracts?.[targetNetwork]?.[contractName.toString()] as Contract<TContractName>;
  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);
  // const publicClient = usePublicClient({ chainId: targetNetwork.id });

  useEffect(() => {
    const checkContractDeployment = async () => {
      try {
        // if (!isMounted() || !publicClient) return;

        if (!deployedContract) {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }

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
  }, [isMounted, contractName, deployedContract]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
  };
};

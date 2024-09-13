
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { useDeployedModuleInfo } from "~~/hooks/scaffold-move";

/**
 * Gets a viem instance of the contract present in deployedContracts.ts or externalContracts.ts corresponding to
 * targetNetworks configured in scaffold.config.ts. Optional walletClient can be passed for doing write transactions.
 * @param config - The config settings for the hook
 * @param config.contractName - deployed contract name
 * @param config.walletClient - optional walletClient from wagmi useWalletClient hook can be passed for doing write transactions
 */
export const useScaffoldContract = <
  TContractName extends string,
  // TWalletClient extends Exclude<GetWalletClientReturnType, null> | undefined,
>({
  contractName,
  // walletClient,
}: {
  contractName: TContractName;
  // walletClient?: TWalletClient | null;
}) => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedModuleInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const aptos = useAptosClient(targetNetwork.id);

  let contract = undefined;
  if (deployedContractData && aptos) {

    // TODO: unfinished

  }}
import { contracts } from "~~/utils/scaffold-move/contract";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";

export function getAllContracts() {
  const { targetNetwork } = useTargetNetwork();

  const contractsData = contracts?.[targetNetwork.id];
  return contractsData ? contractsData : {};
}

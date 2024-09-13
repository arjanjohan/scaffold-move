import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { contracts } from "~~/utils/scaffold-move/contract";

export function getAllContracts() {
  const { targetNetwork } = useTargetNetwork();

  const contractsData = contracts?.[targetNetwork.id];
  return contractsData ? contractsData : {};
}

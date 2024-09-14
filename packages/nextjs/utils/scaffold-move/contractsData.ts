import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { contracts } from "~~/utils/scaffold-move/contract";

export function getAllContracts(chainId: string) {
  const contractsData = contracts?.[chainId];
  return contractsData ? contractsData : {};
}

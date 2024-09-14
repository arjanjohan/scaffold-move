import { contracts } from "~~/utils/scaffold-move/module";

export function getAllModules(chainId: string) {
  const contractsData = contracts?.[chainId];
  return contractsData ? contractsData : {};
}

import { modules } from "~~/utils/scaffold-move/module";

export function getAllModules(chainId: string) {
  const contractsData = modules?.[chainId];
  return contractsData ? contractsData : {};
}

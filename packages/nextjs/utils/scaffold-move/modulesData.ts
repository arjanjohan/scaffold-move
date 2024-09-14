import { modules } from "~~/utils/scaffold-move/module";

export function getAllModules(chainId: string) {
  const modulesData = modules?.[chainId];
  return modulesData ? modulesData : {};
}

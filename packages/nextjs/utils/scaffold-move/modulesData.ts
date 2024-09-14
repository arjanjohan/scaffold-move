import { GenericModule, modules } from "~~/utils/scaffold-move/module";

export function getAllModules(chainId: string) {
  return modules?.[chainId] ?? {};
}

export function getModule(moduleName: string, chainId: string): GenericModule | undefined {
  return modules?.[chainId]?.[moduleName] ?? undefined;
}

import { GenericModule, modules } from "~~/utils/scaffold-move/module";

export function getAllModules(chainId: number) {
  return modules?.[chainId] ?? {};
}

export function getModule(moduleName: string, chainId: number): GenericModule | undefined {
  return modules?.[chainId]?.[moduleName] ?? undefined;
}

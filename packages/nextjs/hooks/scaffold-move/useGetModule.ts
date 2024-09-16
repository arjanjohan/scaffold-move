import { useTargetNetwork } from "./useTargetNetwork";
import { GenericModule } from "~~/utils/scaffold-move/module";
import { getModule } from "~~/utils/scaffold-move/modulesData";

export function useGetModule(moduleName: string): GenericModule | undefined {
  const { targetNetwork } = useTargetNetwork();

  return getModule(moduleName, targetNetwork.id);
}

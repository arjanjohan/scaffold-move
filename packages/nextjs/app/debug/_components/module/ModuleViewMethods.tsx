import { ViewFunctionForm } from "~~/app/debug/_components/module";
import { Module, ModuleName, MoveFunction } from "~~/utils/scaffold-move/module";

export const ModuleViewMethods = ({
  deployedModuleData: deployedModuleData,
}: {
  deployedModuleData: Module<ModuleName>;
}) => {
  if (!deployedModuleData || !deployedModuleData.abi) {
    return null;
  }

  const functionsToDisplay = deployedModuleData.abi.exposed_functions.filter((fn: MoveFunction) => fn.is_view);

  if (!functionsToDisplay.length) {
    return <>No view functions</>;
  }

  return (
    <>
      {functionsToDisplay.map((fn: MoveFunction, index: number) => (
        <div key={index}>
          <ViewFunctionForm module={deployedModuleData.abi} fn={fn} />
        </div>
      ))}
    </>
  );
};

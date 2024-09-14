import { Types } from "aptos";
import { WriteFunctionForm } from "~~/app/debug/_components/module";
import { Module, ModuleName } from "~~/utils/scaffold-move/module";

export const ModuleViewMethods = ({
  deployedModuleData: deployedModuleData,
}: {
  deployedModuleData: Module<ModuleName>;
}) => {
  if (!deployedModuleData || deployedModuleData.abi === undefined) {
    return null;
  }

  const functionsToDisplay = deployedModuleData.abi.exposed_functions.filter((fn: Types.MoveFunction) => fn.is_view);

  if (!functionsToDisplay.length) {
    return <>No view functions</>;
  }

  return (
    <>
      {functionsToDisplay.map((fn: Types.MoveFunction, index: number) => (
        <div key={index}>
          <WriteFunctionForm key={index} module={deployedModuleData.abi!} fn={fn} write={false} />
        </div>
      ))}
    </>
  );
};

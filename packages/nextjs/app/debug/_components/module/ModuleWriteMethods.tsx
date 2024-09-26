import { WriteFunctionForm } from "~~/app/debug/_components/module";
import { Module, ModuleName, MoveFunction } from "~~/utils/scaffold-move/module";

export const ModuleWriteMethods = ({
  deployedModuleData: deployedModuleData,
}: {
  deployedModuleData: Module<ModuleName>;
}) => {
  if (!deployedModuleData.abi) {
    return <p>No ABI available for this module.</p>;
  }

  const functionsToDisplay = deployedModuleData.abi.exposed_functions.filter((fn: MoveFunction) => fn.is_entry);

  if (!functionsToDisplay.length) {
    return <>No write functions</>;
  }

  return (
    <>
      {functionsToDisplay.map((fn: MoveFunction, index: number) => (
        <div key={index}>
          <WriteFunctionForm key={index} module={deployedModuleData.abi} fn={fn} write={true} />
        </div>
      ))}
    </>
  );
};

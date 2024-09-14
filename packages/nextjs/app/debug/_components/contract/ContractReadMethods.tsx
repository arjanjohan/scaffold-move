import { Types } from "aptos";
import { WriteFunctionForm } from "~~/app/debug/_components/contract";
import { Module, ModuleName } from "~~/utils/scaffold-move/module";

export const ContractReadMethods = ({ deployedContractData }: { deployedContractData: Module<ModuleName> }) => {
  if (!deployedContractData || deployedContractData.abi === undefined) {
    return null;
  }

  const functionsToDisplay = deployedContractData.abi.exposed_functions.filter((fn: Types.MoveFunction) => fn.is_view);

  if (!functionsToDisplay.length) {
    return <>No view functions</>;
  }

  return (
    <>
      {functionsToDisplay.map((fn: Types.MoveFunction, index: number) => (
        <div key={index}>
          <WriteFunctionForm key={index} module={deployedContractData.abi!} fn={fn} write={false} />
        </div>
      ))}
    </>
  );
};

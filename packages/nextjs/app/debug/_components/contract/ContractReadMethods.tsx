import { Types } from "aptos";
import { FunctionForm } from "~~/app/debug/_components/contract";
import { Contract, ContractName } from "~~/utils/scaffold-move/contract";

export const ContractReadMethods = ({ deployedContractData }: { deployedContractData: Contract<ContractName> }) => {
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
          <FunctionForm key={index} module={deployedContractData.abi!} fn={fn} write={false} />
        </div>
      ))}
    </>
  );
};

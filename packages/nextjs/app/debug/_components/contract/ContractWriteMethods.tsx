import { FunctionForm } from "~~/app/debug/_components/contract";
import { Contract, ContractName } from "~~/utils/scaffold-move/contract";

export const ContractWriteMethods = ({ deployedContractData }: { deployedContractData: Contract<ContractName> }) => {
  if (!deployedContractData || deployedContractData.abi === undefined) {
    return null;
  }

  const functionsToDisplay = deployedContractData.abi.exposed_functions.filter(fn => fn.is_entry);

  if (!functionsToDisplay.length) {
    return <>No write functions</>;
  }

  return (
    <>
      {functionsToDisplay.map((fn, index) => (
        <div key={index}>
          <FunctionForm key={index} module={deployedContractData.abi!} fn={fn} write={true} />
        </div>
      ))}
    </>
  );
};

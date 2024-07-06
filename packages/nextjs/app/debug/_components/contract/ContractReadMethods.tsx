import { FunctionForm } from "~~/app/debug/_components/contract";
import { Contract, ContractName } from "~~/utils/scaffold-move/contract";

export const ContractReadMethods = ({ 
  deployedContractData
 }: { 
  deployedContractData: Contract<ContractName> 
}) => {
  if (!deployedContractData || deployedContractData.abi === undefined) {
    return null;
  }

  const functionsToDisplay = deployedContractData.abi.exposed_functions.filter((fn) =>
    fn.is_view,
  );

  if (!functionsToDisplay.length) {
    return <>No read methods</>;
  }

  return (
    <>
      {/* {functionsToDisplay.map(({ fn }) => (
        <WriteOnlyFunctionForm
          module={deployedContractData}
          fn={fn}
        />
      ))} */}
        <FunctionForm
          module={deployedContractData.abi}
          fn={functionsToDisplay[0]}
          write={false}
        />
    </>
  );
};

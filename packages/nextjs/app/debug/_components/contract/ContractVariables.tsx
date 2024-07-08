import { AbiFunction } from "abitype";
import { Contract, ContractName } from "~~/utils/scaffold-move/contract";

export const ContractVariables = ({
  deployedContractData,
}: {
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData) {
    return null;
  }
  // const functionsToDisplay = (
  //   (deployedContractData.abi as Abi).filter(part => part.type === "function") as AbiFunction[]
  // )
  //   .filter(fn => {
  //     const isQueryableWithNoParams =
  //       (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;
  //     return isQueryableWithNoParams;
  //   })
  //   .map(fn => {
  //     return {
  //       fn,
  //       inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name],
  //     };
  //   })
  //   .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1));
  const functionsToDisplay = [] as AbiFunction[];
  if (!functionsToDisplay.length) {
    return <>No contract variables</>;
  }
  return <>No contract variables</>;
  // return (
  //   <>
  //     {functionsToDisplay.map(({ fn, inheritedFrom }) => (
  //       <DisplayVariable
  //         abi={deployedContractData.abi as Abi}
  //         abiFunction={fn}
  //         contractAddress={deployedContractData.address}
  //         key={fn.name}
  //         refreshDisplayVariables={refreshDisplayVariables}
  //         inheritedFrom={inheritedFrom}
  //       />
  //     ))}
  //   </>
  // );
};

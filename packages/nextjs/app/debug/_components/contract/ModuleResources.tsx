import { FunctionForm } from "~~/app/debug/_components/contract";
import { Contract, ContractName } from "~~/utils/scaffold-move/contract";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useEffect, useState } from 'react';
import {Types} from "aptos";
import {useGetAccountResources} from "~~/hooks/scaffold-move";
import { ModuleResource } from "./ModuleResource";


export const ModuleResources = ({
  deployedContractData,
}: {
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData || deployedContractData.abi === undefined) {
    return null;
  }

  const {isLoading, data, error} = useGetAccountResources(deployedContractData.abi!.address);

  
  const [accountResources, setAccountResources] =
    useState<Types.MoveResource[] | null>(null);


  if (!data?.length) {
    return <>No resources</>;
  }
  return (
    <>
      {isLoading && <span className="loading loading-spinner loading-xs"></span>}

      {data.map((resource, index) => (
        <div key={index}>
        <ModuleResource
          key={index}
          resource={resource}
          collapsedByDefault={true}
          
        /></div>
      ))}
    </>
  );
};

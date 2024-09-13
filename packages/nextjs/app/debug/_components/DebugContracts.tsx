"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractUI } from "~~/app/debug/_components/contract";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-move/contract";
import { getAllContracts } from "~~/utils/scaffold-move/contractsData";

export function DebugContracts() {
  const { targetNetwork } = useTargetNetwork();

  // Fetch the contracts data based on the target network
  const contractsData = getAllContracts(targetNetwork.id);
  const contractNames = Object.keys(contractsData) as ContractName[];

  const selectedContractStorageKey = "scaffoldMove.selectedContract";

  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract, contractNames]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {contractNames.length === 0 ? (
        <p className="text-3xl mt-14">No modules found!</p>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {contractNames.map(contractName => (
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    contractName === selectedContract
                      ? "bg-base-300 hover:bg-base-300 no-animation"
                      : "bg-base-100 hover:bg-secondary"
                  }`}
                  key={contractName as string}
                  onClick={() => setSelectedContract(contractName)}
                >
                  {contractName as string}
                  {contractsData[contractName as string].external && (
                    <span className="tooltip tooltip-top tooltip-accent" data-tip="External module">
                      <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {contractNames.map(contractName => (
            <ContractUI
              key={contractName as string}
              contractName={contractName}
              className={contractName === selectedContract ? "" : "hidden"}
            />
          ))}
        </>
      )}
    </div>
  );
}

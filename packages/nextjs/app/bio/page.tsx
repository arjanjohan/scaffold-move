"use client";

import { useState } from "react";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { InputBase } from "~~/components/scaffold-move";
import { useAptosClient } from "~~/hooks/scaffold-move";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { getModule } from "~~/utils/scaffold-move/modulesData";

// Alert Component for showing error messages or warnings
const Alert = ({ message }: { message: string }) => (
  <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
    <p className="text-3xl mt-14">{message}</p>
  </div>
);

const OnchainBio: NextPage = () => {
  const { account } = useWallet();
  const network = useTargetNetwork();
  const chainId = network.targetNetwork.id;
  const aptos = useAptosClient(chainId);

  const [inputName, setInputName] = useState<string>("");
  const [inputBio, setInputBio] = useState<string>("");

  const [accountHasBio, setAccountHasBio] = useState(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [currentBio, setCurrentBio] = useState<string | null>(null);

  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction();

  const moveModule = getModule("onchain_bio", chainId);
  const bioModule = moveModule?.abi;

  // If the bioModule or ABI is not found, show an alert message and return early
  if (!bioModule) {
    return <Alert message="Onchain Bio module not found!" />;
  }

  // Fetch bio details from the blockchain
  const fetchBio = async () => {
    if (!account) return;

    try {
      const resourceName = "Bio";

      const bioResource = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: `${bioModule.address}::${bioModule.name}::${resourceName}`,
      });

      if (bioResource) {
        setAccountHasBio(true);
        setCurrentName(bioResource.name);
        setCurrentBio(bioResource.bio);
      } else {
        clearBio();
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
      setAccountHasBio(false);
      clearBio();
    }
  };

  const registerBio = async () => {
    if (!inputName || !inputBio) {
      console.error("Name or Bio is missing");
      return;
    }

    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${bioModule.address}::${bioModule.name}::register`,
          functionArguments: [inputName, inputBio],
        },
      };

      await submitTransaction(transaction);
      await fetchBio();

      if (transactionResponse?.transactionSubmitted) {
        console.log("Transaction successful:", transactionResponse.success ? "success" : "failed");
      }
    } catch (error) {
      console.error("Error registering bio:", error);
    }
  };

  // Helper to clear bio state
  const clearBio = () => {
    setCurrentName(null);
    setCurrentBio(null);
  };

  return (
    <div className="flex items-center flex-col flex-grow">
      <div className="flex flex-col items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
        <div className="text-xl">Your Onchain Bio</div>
      </div>

      <div className="flex flex-col space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
        <div className="flex items-center ml-2">
          <span className="text-xs font-medium mr-2 leading-none">Your Name</span>
        </div>
        <div className="w-full flex flex-col space-y-2">
          <InputBase placeholder="Name" value={inputName} onChange={setInputName} />
        </div>
        <div className="flex items-center ml-2">
          <span className="text-xs font-medium mr-2 leading-none">Your Bio</span>
        </div>
        <div className="w-full flex flex-col space-y-2">
          <InputBase placeholder="Bio" value={inputBio} onChange={setInputBio} />
        </div>
        <button className="btn btn-secondary mt-2" disabled={!account} onClick={registerBio}>
          Register Bio
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
        <button className="btn btn-secondary mt-2" disabled={!account} onClick={fetchBio}>
          Fetch Bio
        </button>

        {accountHasBio && !transactionInProcess && (
          <div className="space-y-4 w-full max-w-lg">
            <div className="flex items-center">
              <span className="text-xs font-medium mr-2 leading-none">Name:</span>
            </div>
            <div className="w-full flex flex-col space-y-2">{currentName}</div>
            <div className="flex items-center">
              <span className="text-xs font-medium mr-2 leading-none">Bio:</span>
            </div>
            <div className="w-full flex flex-col space-y-2">{currentBio}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnchainBio;

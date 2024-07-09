"use client";

import { useState } from "react";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { InputBase } from "~~/components/scaffold-eth";
import deployedModules from "~~/contracts/deployedModules";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { useGetAccountModules } from "~~/hooks/scaffold-move/useGetAccountModules";
import { aptosClient } from "~~/utils/scaffold-move/aptosClient";

const aptos = aptosClient("m1_devnet");

const ONCHAIN_BIO = deployedModules.devnet.onchain_bio.abi;

const OnchainBio: NextPage = () => {
  const { account } = useWallet();

  const [inputName, setInputName] = useState<string>("");
  const [inputBio, setInputBio] = useState<string>("");

  const [accountHasBio, setAccountHasBio] = useState(false);
  const [currentName, setCurrentName] = useState(null);
  const [currentBio, setCurrentBio] = useState(null);

  const {data, isLoading, error} = useGetAccountModules(ONCHAIN_BIO.address);


  const {submitTransaction, transactionResponse, transactionInProcess} =
    useSubmitTransaction();

  const fetchBio = async () => {
    if (!account) {
      return [];
    }
    try {

      const resourceName = "Bio";
      const bioResource = await aptos.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${ONCHAIN_BIO.address}::${ONCHAIN_BIO.name}::${resourceName}`,
      });
      setAccountHasBio(true);
      if (bioResource) {
        setCurrentName(bioResource.name);
        setCurrentBio(bioResource.bio);
      } else {
        setCurrentName(null);
        setCurrentBio(null);
      }
    } catch (e: any) {
      setAccountHasBio(false);
    }
  };

  async function registerBio() {
    if (inputName === null || inputBio === null) {
      // error msg popup
    } else {
      const onchainName = inputName;
      const onchainBio = inputBio;
      const functionName = "register";
      const transaction: InputTransactionData = {
        data: {
          function: `${ONCHAIN_BIO.address}::${ONCHAIN_BIO.name}::${functionName}`,
          functionArguments: [onchainName, onchainBio],
        },
      };
      await submitTransaction(transaction);

      fetchBio();

      // TODO: no transactionResponse?
      if (transactionResponse?.transactionSubmitted) {
        console.log("function_interacted", {
          txn_status: transactionResponse.success ? "success" : "failed",
        });
      }
    }
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow ">
        <div className="flex flex-col items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">Your Onchain Bio</div>
        </div>

        {/* Create bio */}
        {/* <div className="flex flex-col gap-1.5 w-full"> */}

        <div className="flex flex-col space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="flex items-center ml-2">
            <span className="text-xs font-medium mr-2 leading-none">Your name</span>
          </div>
          <div className="w-full flex flex-col space-y-2">
            <InputBase placeholder="Name" value={inputName} onChange={value => setInputName(value)} />
          </div>
          <div className="flex items-center ml-2">
            <span className="text-xs font-medium mr-2 leading-none">Your bio</span>
          </div>{" "}
          <div className="w-full flex flex-col space-y-2">
            <InputBase placeholder="Bio" value={inputBio} onChange={value => setInputBio(value)} />
          </div>
          <button
            className="btn btn-secondary mt-2"
            disabled={!account}
            onClick={async () => {
              try {
                await registerBio();
              } catch (err) {
                console.error("Error calling registerBio function");
              }
            }}
          >
            Register Bio
          </button>
        </div>

        {/* Fetch  bio */}
        <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <button
            className="btn btn-secondary mt-2"
            disabled={!account}
            onClick={async () => {
              try {
                await fetchBio();
              } catch (err) {
                console.error("Error calling fetchBio function");
              }
            }}
          >
            Fetch Bio
          </button>


        {accountHasBio && !transactionInProcess && (
        <div className="space-y-4 w-full max-w-lg">
          <div className="flex items-center">
            <span className="text-xs font-medium mr-2 leading-none">Name:</span>
          </div>
          <div className="w-full flex flex-col space-y-2">
            {currentName}
          </div>            
          <div className="flex items-center">
            <span className="text-xs font-medium mr-2 leading-none">Bio:</span>
          </div>
          <div className="w-full flex flex-col space-y-2">
            {currentBio}
          </div>       
          </div>
        )}
        </div>

      </div>
    </>
  );
};

export default OnchainBio;

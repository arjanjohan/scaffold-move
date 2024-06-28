"use client";

import { useRef, useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { InputBase } from "~~/components/scaffold-eth";
import moveContracts from "~~/contracts/moveContracts";

// TODO: move this somewhere global
const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://aptos.devnet.m1.movementlabs.xyz",
  indexer: "https://indexer.devnet.m1.movementlabs.xyz/",
  faucet: "https://faucet2.movementlabs.xyz",
});
const aptos = new Aptos(aptosConfig);

const ONCHAIN_BIO = moveContracts.ONCHAIN_BIO;

const OnchainBio: NextPage = () => {
  const { signAndSubmitTransaction, account } = useWallet();
  const name = useRef<HTMLInputElement>(null);
  const bio = useRef<HTMLTextAreaElement>(null);

  const [inputName, setInputName] = useState<string>("");
  const [inputBio, setInputBio] = useState<string>("");

  const [accountHasBio, setAccountHasBio] = useState(false);
  const [currentName, setCurrentName] = useState(null);
  const [currentBio, setCurrentBio] = useState(null);

  const fetchBio = async () => {
    if (!account) {
      console.log("No account");
      return [];
    }
    try {
      const bioResource = await aptos.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${ONCHAIN_BIO.address}::${ONCHAIN_BIO.modules.onchain_bio.name}::${ONCHAIN_BIO.modules.onchain_bio.resources.Bio}`,
      });
      console.log("Name:", bioResource.name, "Bio:", bioResource.bio);
      setAccountHasBio(true);
      if (bioResource) {
        setCurrentName(bioResource.name);
        setCurrentBio(bioResource.bio);
      } else {
        console.log("no bio");
      }
    } catch (e: any) {
      setAccountHasBio(false);
    }
  };

  async function registerBio() {
    if (bio.current === null || name.current === null) {
      // error msg popup
    } else {
      const onchainName = name.current.value;
      const onchainBio = bio.current.value;
      const transaction: InputTransactionData = {
        data: {
          function: `${ONCHAIN_BIO.address}::${ONCHAIN_BIO.modules.onchain_bio.name}::${ONCHAIN_BIO.modules.onchain_bio.functions.register}`,
          functionArguments: [onchainName, onchainBio],
        },
      };
      try {
        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        console.log(`Success! View your transaction at https://explorer.aptoslabs.com/txn/${response.hash}`); // todo: store explorer link in config
        await aptos.waitForTransaction({ transactionHash: response.hash });
        fetchBio();
      } catch (error: any) {
        console.log("Error:", error);
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
        </div>

        {accountHasBio && (
          <div>
            <div>{currentName}</div>
            <div>{currentBio}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default OnchainBio;

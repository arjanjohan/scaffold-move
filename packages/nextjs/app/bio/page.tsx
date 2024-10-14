"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { Address, InputBase } from "~~/components/scaffold-move";
import { useGetAccountResource } from "~~/hooks/scaffold-move";
import { useGetModule } from "~~/hooks/scaffold-move/useGetModule";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { useView } from "~~/hooks/scaffold-move/useView";

// Alert Component for showing error messages or warnings
const Alert = ({ message }: { message: string }) => (
  <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
    <p className="text-3xl mt-14">{message}</p>
  </div>
);

const OnchainBio: NextPage = () => {
  const { account } = useWallet();

  const [inputName, setInputName] = useState<string>("");
  const [inputBio, setInputBio] = useState<string>("");

  const [accountHasBio, setAccountHasBio] = useState(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [currentBio, setCurrentBio] = useState<string | null>(null);

  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction("onchain_bio");

  const moveModule = useGetModule("onchain_bio");
  const bioAbi = moveModule?.abi;

  const { data: bioResource, refetch: refetchBio } = useGetAccountResource("onchain_bio", "Bio");

  const {
    data: bioView,
    isLoading: isLoadingBioView,
    refetch: refetchBioView,
  } = useView({ moduleName: "onchain_bio", functionName: "get_bio", args: [account?.address] });

  // If the bioModule or ABI is not found, show an alert message and return early
  if (!bioAbi) {
    return <Alert message="Onchain Bio module not found!" />;
  }

  // Fetch bio details from the blockchain
  const fetchBio = async () => {
    if (!account) return;

    try {
      await refetchBio();
      console;
      if (bioResource) {
        setAccountHasBio(true);

        // TODO: Fix this workaround
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
      await submitTransaction("register", [inputName, inputBio]);

      // await fetchBio();
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
      <div className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl p-6 mt-8 w-full max-w-lg">
        <div className="text-xl">Your Onchain Bio</div>
        <p className="text-sm mb-2">This is your decentralized profile stored on the Aptos blockchain.</p>
        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Connected Address:</p>

          <Address address={account?.address} />
        </div>{" "}
      </div>
      <div className="flex flex-col items-center space-y-4 bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 p-6 mt-8 w-full max-w-lg">
        <h2 className="text-lg font-semibold">Register or Update Your Bio</h2>
        <p className="text-sm">
          Enter your name and a short bio to store on-chain using the{" "}
          <Link
            className="underline"
            href="https://scaffold-move-docs.vercel.app/hooks/usesubmittransaction"
            target="_blank"
            rel="noopener noreferrer"
          >
            useSubmitTransaction
          </Link>{" "}
          hook from Scaffold Move.
        </p>
        <div className="flex items-center ml-2">
          <span className="text-xs font-medium mr-2 leading-none">Your Name</span>
        </div>
        <div className="w-full flex flex-col space-y-2">
          <InputBase placeholder="Enter your name" value={inputName} onChange={setInputName} />
        </div>
        <div className="flex items-center ml-2">
          <span className="text-xs font-medium mr-2 leading-none">Your Bio</span>
        </div>
        <div className="w-full flex flex-col space-y-2">
          <InputBase placeholder="Write a short bio about yourself" value={inputBio} onChange={setInputBio} />
        </div>
        <button className="btn btn-secondary mt-2" disabled={!account} onClick={registerBio}>
          Register Bio
        </button>
      </div>
      <div className="flex flex-col items-center space-y-4 bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 p-6 mt-8 w-full max-w-lg">
        <h2 className="text-lg font-semibold">Fetch Bio Resource</h2>
        <p className="text-sm">
          {" "}
          Fetch bio data directly from the resource account on the Aptos blockchain using the Scaffold Move{" "}
          <Link
            className="underline"
            href="https://scaffold-move-docs.vercel.app/hooks/usegetaccountresource"
            target="_blank"
            rel="noopener noreferrer"
          >
            useGetAccountResource
          </Link>{" "}
          hook.
        </p>
        <button className="btn btn-secondary mt-2" disabled={!account} onClick={fetchBio}>
          Fetch Bio Resource
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

      <div className="flex flex-col items-center space-y-4 bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 p-6 mt-8 w-full max-w-lg">
        <h2 className="text-lg font-semibold">View Bio</h2>
        <p className="text-sm">
          Read bio data from the Aptos blockchain using a view function using the Scaffold Move{" "}
          <Link
            className="underline"
            href="https://scaffold-move-docs.vercel.app/hooks/useview"
            target="_blank"
            rel="noopener noreferrer"
          >
            useView
          </Link>{" "}
          hook.
        </p>
        <button className="btn btn-secondary mt-2" disabled={!account} onClick={() => refetchBioView()}>
          View Bio
        </button>

        {bioView && !isLoadingBioView && (
          <div className="space-y-4 w-full max-w-lg">
            <div className="flex items-center">
              <span className="text-xs font-medium mr-2 leading-none">Bio:</span>
            </div>
            <div className="w-full flex flex-col space-y-2">{bioView}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnchainBio;

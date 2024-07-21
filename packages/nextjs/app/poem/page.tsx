"use client";

import { useState } from "react";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { InputBase } from "~~/components/scaffold-eth";
import deployedModules from "~~/contracts/deployedModules";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { aptosClient } from "~~/utils/scaffold-move/aptosClient";

const aptos = aptosClient("m1_devnet");

const OnchainPoem: NextPage = () => {
  if (!deployedModules.devnet || !deployedModules.devnet.onchain_poems) {
    return (
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        <p className="text-3xl mt-14">onchain_poem module not found!</p>
      </div>
    );
  }

  const ONCHAIN_POEM = deployedModules.devnet.onchain_poems.abi;

  const { account } = useWallet();

  const [inputPoem, setInputPoem] = useState<string>("");
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputAuthor, setInputAuthor] = useState<string>("");

  const [accountHasPoem, setAccountHasPoem] = useState(false);
  const [currentPoem, setCurrentPoem] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentAuthor, setCurrentAuthor] = useState(null);

  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction();

  const fetchPoem = async () => {
    if (!account) {
      return [];
    }
    try {
      const resourceName = "Inscription";
      const poemResource = await aptos.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${ONCHAIN_POEM.address}::${ONCHAIN_POEM.name}::${resourceName}`,
      });
      setAccountHasPoem(true);
      if (poemResource) {
        setCurrentPoem(poemResource.poem);
        setCurrentTitle(poemResource.title);
        setCurrentAuthor(poemResource.author);
      } else {
        setCurrentPoem(null);
        setCurrentTitle(null);
        setCurrentAuthor(null);
      }
    } catch (e: any) {
      setAccountHasPoem(false);
    }
  };

  async function registerPoem() {
    if (inputPoem === null || inputTitle === null || inputAuthor === null) {
    } else {
      const functionName = "register";
      const transaction: InputTransactionData = {
        data: {
          function: `${ONCHAIN_POEM.address}::${ONCHAIN_POEM.name}::${functionName}`,
          functionArguments: [inputPoem, inputTitle, inputAuthor],
        },
      };
      await submitTransaction(transaction);

      fetchPoem();

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
          <div className="text-xl">Your Onchain Poem</div>
        </div>

        {/* Create poem */}
        <div className="flex flex-col space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="flex items-center ml-2">
            <span className="text-xs font-medium mr-2 leading-none">Poem author</span>
          </div>
          <div className="w-full flex flex-col space-y-2">
            <InputBase placeholder="Author" value={inputAuthor} onChange={value => setInputAuthor(value)} />
          </div>
          <div className="flex items-center ml-2">
            <span className="text-xs font-medium mr-2 leading-none">Poem title</span>
          </div>
          <div className="w-full flex flex-col space-y-2">
            <InputBase placeholder="Title" value={inputTitle} onChange={value => setInputTitle(value)} />
          </div>
          <div className="flex items-center ml-2">
            <span className="text-xs font-medium mr-2 leading-none">Poem text</span>
          </div>{" "}
          <div className="w-full flex flex-col space-y-2">
            <InputBase placeholder="Poem" value={inputPoem} onChange={value => setInputPoem(value)} />
          </div>
          <button
            className="btn btn-secondary mt-2"
            disabled={!account || accountHasPoem}
            onClick={async () => {
              try {
                await registerPoem();
              } catch (err) {
                console.error("Error calling registerPoem function");
              }
            }}
          >
            Register Poem
          </button>
        </div>

        {/* Fetch  poem */}
        <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <button
            className="btn btn-secondary mt-2"
            disabled={!account}
            onClick={async () => {
              try {
                await fetchPoem();
              } catch (err) {
                console.error("Error calling fetchPoem function");
              }
            }}
          >
            Fetch Poem
          </button>

          {accountHasPoem && !transactionInProcess && (
            <div className="space-y-4 w-full max-w-lg">
              <div className="flex items-center">
                <span className="text-s font-medium mr-2 leading-none">
                  {currentTitle} by {currentAuthor}
                </span>
              </div>
              <div className="w-full flex flex-col space-y-2">{currentPoem}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OnchainPoem;

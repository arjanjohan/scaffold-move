"use client";

import { useState } from "react";
import { useFunctionArguments } from "./utilFunctionArgs";
import { parseTypeTag } from "@aptos-labs/ts-sdk";
import { useWallet } from "@scaffold-move/wallet-adapter-react";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import {
  ExtractMoveParams,
  GenericModuleAbi,
  ModuleEntryFunctionNames,
  ModuleEntryFunctions,
  ModuleName,
  MoveFunction,
} from "~~/utils/scaffold-move/module";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-move/networks";

type FunctionFormProps = {
  module: GenericModuleAbi;
  fn: MoveFunction;
  write: boolean;
};

function removeSignerParam(fn: MoveFunction) {
  return fn.params.filter(p => p !== "signer" && p !== "&signer");
}

export const WriteFunctionForm = ({ module, fn }: FunctionFormProps) => {
  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction(
    module.name as ModuleName,
  );
  const fnParams = removeSignerParam(fn);

  const [error, setError] = useState<string | null>(null);
  const { data, handleTypeArgChange, handleArgChange } = useFunctionArguments(
    fn.generic_type_params.length,
    fnParams.length,
  );
  const { account } = useWallet();
  const network = useTargetNetwork();

  const convertArgument = (arg: string | null | undefined, type: string): any => {
    if (typeof arg !== "string") {
      arg = "";
    }
    arg = arg.trim();
    const typeTag = parseTypeTag(type);
    if (typeTag.isVector()) {
      const innerTag = typeTag.value;
      if (innerTag.isVector()) {
        return JSON.parse(arg) as any[];
      }
      if (innerTag.isU8()) {
        if (arg.startsWith("0x")) {
          return arg;
        }
      }
      if (arg.startsWith("[")) {
        return JSON.parse(arg) as any[];
      } else {
        return arg.split(",").map(arg => {
          return arg.trim();
        });
      }
    } else if (typeTag.isStruct()) {
      if (typeTag.isOption()) {
        if (arg === "") {
          return undefined;
        } else {
          arg = convertArgument(arg, typeTag.value.typeArgs[0].toString());
          return arg;
        }
      }
    }
    return arg;
  };

  const handleWrite = async () => {
    // const typeArguments = data.typeArgs;
    const functionArguments = data.args.map((arg, i) => {
      const type = fnParams[i];
      return convertArgument(arg, type);
    }) as ExtractMoveParams<(typeof fn)["params"]>;
    const typeArguments =
      data.typeArgs as ModuleEntryFunctions<ModuleName>[ModuleEntryFunctionNames<ModuleName>]["tyArgs"];

    try {
      await submitTransaction(fn.name as ModuleEntryFunctionNames<ModuleName>, functionArguments, typeArguments);
      if (transactionResponse?.transactionSubmitted) {
        console.log("function_interacted", fn.name, {
          txn_status: transactionResponse.success ? "success" : "failed",
        });
        if (!transactionResponse.success) {
          setError("❌ Transaction failed");
        } else {
          setError(null); // Clear any previous error
        }
      }
    } catch (e: any) {
      console.error("⚡️ ~ file: FunctionForm.tsx:handleWrite ~ error", e);
      setError("❌ Transaction failed: " + e.message);
    }
  };

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={"flex gap-3 flex-col"}>
        <p className="font-medium my-0 break-words">{fn.name}</p>
        {/* Type Arguments */}
        {data.typeArgs.map(
          (_, i) => (
            console.log(data.typeArgs),
            (
              <div key={`type-arg-${i}`} className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center mt-2 ml-2">
                  <span className="block text-xs font-extralight leading-none">{`T${i}:`}</span>
                </div>
                <div className={"flex border-2 border-base-300 bg-base-200 rounded-full text-accent"}>
                  <input
                    placeholder={`Type Argument ${i}`}
                    className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                    onChange={e => handleTypeArgChange(i, e.target.value)}
                  />
                </div>
              </div>
            )
          ),
        )}
        {/* Function Arguments */}
        {fnParams.map((param, i) => {
          return (
            <div key={`arg-${i}`} className="flex flex-col gap-1.5 w-full">
              <div className="flex items-center mt-2 ml-2">
                <span className="block text-xs font-extralight leading-none">{`arg${i}:`}</span>
              </div>
              <div className={"flex border-2 border-base-300 bg-base-200 rounded-full text-accent"}>
                <input
                  placeholder={param}
                  className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                  onChange={e => handleArgChange(i, e.target.value)}
                />
              </div>
            </div>
          );
        })}

        <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap">
          <div className="flex-grow basis-0">
            {transactionResponse !== null && transactionResponse?.transactionSubmitted && (
              <div className="bg-base-300 rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
                <pre className="whitespace-pre-wrap break-words">
                  <span className="font-bold">Result: </span>
                  {transactionResponse.success ? (
                    <>
                      ✅ transaction successful
                      {getBlockExplorerTxLink(network.targetNetwork, transactionResponse.transactionHash) && (
                        <>
                          <br />
                          <a
                            href={getBlockExplorerTxLink(network.targetNetwork, transactionResponse.transactionHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View on Explorer
                          </a>
                        </>
                      )}
                    </>
                  ) : (
                    "❌ transaction failed"
                  )}
                </pre>
              </div>
            )}
            {error && (
              <div className="bg-red-300 rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
                <p className="font-bold m-0 mb-1">Error:</p>
                <pre className="whitespace-pre-wrap break-words">{error}</pre>
              </div>
            )}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            disabled={transactionInProcess || !account}
            onClick={handleWrite}
          >
            {transactionInProcess && <span className="loading loading-spinner loading-xs"></span>}
            Send 💸
          </button>
        </div>
      </div>
    </div>
  );
};

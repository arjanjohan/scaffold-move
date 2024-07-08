"use client";

import { Types } from "aptos";
import { parseTypeTag } from "@aptos-labs/ts-sdk";
import {
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { encodeInputArgsForViewRequest } from "../../../../utils/utils";
import { view } from "~~/hooks";
// import { useGlobalState } from "../../../../global-config/GlobalConfig";
import { displayTxResult } from "~~/app/debug/_components/contract";

const zeroInputs = false;

type ContractFormType = {
  typeArgs: string[];
  args: string[];
  ledgerVersion?: string;
};

type FunctionFormProps = {
  key: number;
  module: Types.MoveModule;
  fn: Types.MoveFunction;
  write: boolean;
};

function removeSignerParam(fn: Types.MoveFunction, write: boolean) {
  if (!write) {
    return fn.params;
  }
  return fn.params.filter((p) => p !== "signer" && p !== "&signer");
}

export const FunctionForm = ({
  key,
  module,
  fn,
  write,
}: FunctionFormProps) => {
  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction();
  const [viewInProcess, setViewInProcess] = useState(false);
  const [result, setResult] = useState<Types.MoveValue[]>();
  const [error, setError] = useState<string | null>(null); // Add error state
  const [data, setData] = useState<ContractFormType>({ typeArgs: [], args: [] });
  // const [state] = useGlobalState();
  const state = {network_value: "https://aptos.devnet.m1.movementlabs.xyz"}

  const fnParams = removeSignerParam(fn, write);

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
        return arg.split(",").map((arg) => {
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
    const payload: InputTransactionData = {
      data: {
        function: `${module.address}::${module.name}::${fn.name}`,
        typeArguments: data.typeArgs,
        functionArguments: data.args.map((arg, i) => {
          const type = fnParams[i];
          return convertArgument(arg, type);
        }),
      },
    };

    try {
      await submitTransaction(payload);

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

  const handleView = async () => {
    let viewRequest: Types.ViewRequest;
    console.log("viewRequest AVH", state.network_value, data.ledgerVersion);

    try {
      viewRequest = {
        function: `${module.address}::${module.name}::${fn.name}`,
        type_arguments: data.typeArgs,
        arguments: data.args.map((arg, i) => {
          return encodeInputArgsForViewRequest(fn.params[i], arg);
        }),
      };
    } catch (e: any) {
      console.error("Parsing arguments failed: " + e?.message);
      setError("Parsing arguments failed: " + e.message);
      return;
    }
    setViewInProcess(true);
    try {
      console.log("viewRequest", viewRequest, state.network_value, data.ledgerVersion);
      const result = await view(viewRequest, state.network_value, data.ledgerVersion);
      setResult(result);
      console.log("function_interacted", result, fn.name, { txn_status: "success" });
      setError(null); // Clear any previous error
    } catch (e: any) {
      let error = e.message ?? JSON.stringify(e);
      const prefix = "Error:";
      if (error.startsWith(prefix)) {
        error = error.substring(prefix.length).trim();
      }
      setResult(undefined);
      setError("❌ View request failed: " + error);
      console.log("AVH function_interacted", error, fn.name, { txn_status: "failed" });
    }
    setViewInProcess(false);
  };

  return (
    <div key={key} className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        <p className="font-medium my-0 break-words">
          {fn.name}
        </p>
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
                  onChange={(e) => {
                    const newArgs = [...data.args];
                    newArgs[i] = e.target.value;
                    setData({ ...data, args: newArgs });
                  }}
                />
              </div>
            </div>
          );
        })}

        {write && (
          <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap">
            <div className="flex-grow basis-0">
              {transactionResponse !== null && transactionResponse?.transactionSubmitted && (
                <div className="bg-base-300 rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
                  <p className="font-bold m-0 mb-1">Result:</p>
                  <pre className="whitespace-pre-wrap break-words">{transactionResponse.success ? "✅ Transaction successful" : "❌ Transaction failed"}</pre>
                </div>
              )}
              {error && (
                <div className="bg-red-300 rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
                  <p className="font-bold m-0 mb-1">Error:</p>
                  <pre className="whitespace-pre-wrap break-words">{error}</pre>
                </div>
              )}
            </div>

            <button className="btn btn-secondary btn-sm" disabled={transactionInProcess} onClick={handleWrite}>
              {transactionInProcess && <span className="loading loading-spinner loading-xs"></span>}
              Send 💸
            </button>
          </div>
        )}
        {!write && (
          <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap">
            <div className="flex-grow w-full md:max-w-[80%]">
              {result !== null && result !== undefined && (
                <div className="bg-base-300 rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
                  <p className="font-bold m-0 mb-1">Result:</p>
                  <pre className="whitespace-pre-wrap break-words">{displayTxResult(result, "sm")}</pre>
                </div>
              )}
              {error && (
                <div className="bg-red-300 rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
                  <p className="font-bold m-0 mb-1">Error:</p>
                  <pre className="whitespace-pre-wrap break-words">{error}</pre>
                </div>
              )}
            </div>

            <button className="btn btn-secondary btn-sm" disabled={viewInProcess} onClick={handleView}>
              {viewInProcess && <span className="loading loading-spinner loading-xs"></span>}
              Read 📡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import {Types} from "aptos";
import {parseTypeTag} from "@aptos-labs/ts-sdk";
import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import {SubmitHandler} from "react-hook-form";


const zeroInputs = false;

type ContractFormType = {
  typeArgs: string[];
  args: string[];
  ledgerVersion?: string;
};

type FunctionFormProps = {
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
  module,
  fn,
  write,
}: FunctionFormProps) => {
  // const [state] = useGlobalState();
  const {connected} = useWallet();
  const [formValid, setFormValid] = useState(false);
  const {submitTransaction, transactionResponse, transactionInProcess} =
    useSubmitTransaction(); 

  const fnParams = removeSignerParam(fn, write);
  // console.log("AVH", module, fn);
  // const fnParams = fn.params;

  // TODO: We should use the SDKv2 for this
  const convertArgument = (
    arg: string | null | undefined,
    type: string,
  ): any => {
    // TypeScript doesn't really protect us from nulls, this enforces it
    if (typeof arg !== "string") {
      arg = "";
    }
    arg = arg.trim();
    const typeTag = parseTypeTag(type);
    if (typeTag.isVector()) {
      const innerTag = typeTag.value;
      if (innerTag.isVector()) {
        // This must be JSON, let's parse it
        return JSON.parse(arg) as any[];
      }

      if (innerTag.isU8()) {
        // U8 we take as an array or hex
        if (arg.startsWith("0x")) {
          // For hex, let the hex pass through
          return arg;
        }
      }

      if (arg.startsWith("[")) {
        // This is supposed to be JSON if it has the bracket
        return JSON.parse(arg) as any[];
      } else {
        // We handle array without brackets otherwise
        return arg.split(",").map((arg) => {
          return arg.trim();
        });
      }
    } else if (typeTag.isStruct()) {
      if (typeTag.isOption()) {
        // This we need to handle if there is no value, we take "empty trimmed" as no value
        if (arg === "") {
          return undefined;
        } else {
          // Convert for the inner type if it isn't empty
          arg = convertArgument(arg, typeTag.value.typeArgs[0].toString());
          return arg;
        }
      }
    }

    // For all other cases return it straight
    return arg;
  };

  // const inputs = transformedFunction.inputs.map((input, inputIndex) => {
  //   const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
  //   return (
  //     <ContractInput
  //       key={key}
  //       setForm={updatedFormValue => {
  //         setDisplayedTxResult(undefined);
  //         setForm(updatedFormValue);
  //       }}
  //       form={form}
  //       stateObjectKey={key}
  //       paramType={input}
  //     />
  //   );
  // });

  const onSubmit: SubmitHandler<ContractFormType> = async (data) => {
    // logEvent("write_button_clicked", fn.name);

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

    await submitTransaction(payload);
    if (transactionResponse?.transactionSubmitted) {
      // logEvent("function_interacted", fn.name, {
      //   txn_status: transactionResponse.success ? "success" : "failed",
      // });
    }
  };

  const isFunctionSuccess = !!(
    transactionResponse?.transactionSubmitted && transactionResponse?.success
  );

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        <p className="font-medium my-0 break-words">
          {fn.name}
        </p>
        {fnParams.map((param, i) => {
              // TODO: Need a nice way to differentiate between option and empty string
              const isOption = param.startsWith("0x1::option::Option");
              return (
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center mt-2 ml-2">
                    <span className="block text-xs font-extralight leading-none">{`arg${i}:`}</span>
                  </div>
                  <div className={"flex border-2 border-base-300 bg-base-200 rounded-full text-accent"}>
                    <input
                      // type={type}
                      // value={value}
                      // onChange={onChange}
                      placeholder={param}
                      // disabled={disabled ? true : false}
                      className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                    />
                  </div>
                </div>
                // <div><p>{`args-${i}`} : {param}</p>
                // <input></input>
                // </div>
                // <ContractInput
                //   key={`args-${i}`}
                //   setForm={updatedFormValue => {
                //     // setDisplayedTxResult(undefined);
                //     // setForm(updatedFormValue);
                //   }}
                //   form={form}
                //   stateObjectKey={key}
                //   paramType={input}
                // />

                // <div>{param}</div>
                // <Controller
                //   key={`args-${i}`}
                //   name={`args.${i}`}
                //   // control={control}
                //   rules={{required: !isOption}}
                //   // render={({field: {onChange, value}}) => (
                //   //   <input
                //   //     onChange={onChange}
                //   //     value={isOption ? value : value ?? ""}
                //   //     // label={`arg${i}: ${param}`}
                //   //     // fullWidth
                //   //   />
                //   // )}
                // />
              );
            })}

        <div className="flex justify-between gap-2">
          {!zeroInputs && (
            <div className="flex-grow basis-0">
              
            </div>
          )}
          {/* <div
            className={`flex ${
              writeDisabled &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
          > */}
            {/* <button className="btn btn-secondary btn-sm" disabled={writeDisabled || isPending} onClick={handleWrite}> */}
            {write && (
              <button className="btn btn-secondary btn-sm">
              {/* {isPending && <span className="loading loading-spinner loading-xs"></span>} */}
              Send 💸
            </button>
            )}
            {!write && (
              <button className="btn btn-secondary btn-sm">
            {/* {isFetching && <span className="loading loading-spinner loading-xs"></span>} */}
            Read 📡
              </button>
            )}
            
          </div>
        {/* </div> */}
      </div>
      {/* {zeroInputs && txResult ? (
        <div className="flex-grow basis-0">
        </div>
      ) : null} */}
    </div>
  );
};
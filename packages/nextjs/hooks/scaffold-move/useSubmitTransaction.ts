import { useEffect, useState } from "react";
import { useGetModule } from "./useGetModule";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { FailedTransactionError } from "aptos";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { ModuleName, ModuleNonViewFunctionNames, ModuleNonViewFunctions } from "~~/utils/scaffold-move/module";

export type TransactionResponse = TransactionResponseOnSubmission | TransactionResponseOnError;

export type UseSubmitTransactionConfig<
  TModuleName extends ModuleName,
  TFunctionName extends ModuleNonViewFunctionNames<TModuleName>
> = {
  moduleName: TModuleName;
  functionName: TFunctionName;
  args: [...ModuleNonViewFunctions<TModuleName>[TFunctionName]["args"]];
  tyArgs?: string[];
};

// "submission" here means that the transaction is posted on chain and gas is paid.
// However, the status of the transaction might not be "success".
export type TransactionResponseOnSubmission = {
  transactionSubmitted: true;
  transactionHash: string;
  success: boolean; // indicates if the transaction submitted but failed or not
  message?: string; // error message if the transaction failed
};

export type TransactionResponseOnError = {
  transactionSubmitted: false;
  message: string;
};
const useSubmitTransaction = <
  TModuleName extends ModuleName,
  TFunctionName extends ModuleNonViewFunctionNames<TModuleName>
>(moduleName: TModuleName) => {
  const [transactionResponse, setTransactionResponse] = useState<TransactionResponse | null>(null);
  const [transactionInProcess, setTransactionInProcess] = useState<boolean>(false);
  const [moduleAddress, setModuleAddress] = useState<string | null>(null);

  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);

  // TODO: with Nightly wallet it can fail because network is mismatched.
  const { signAndSubmitTransaction } = useWallet();

  const moveModule = useGetModule(moduleName.toString());
  if (!moveModule) {
    throw new Error("Module not found");
  }
  useEffect(() => {
    if (moveModule) {
      setModuleAddress(moveModule.abi.address);
    } else {
      throw new Error("Module not found");
    }
  }, [moveModule]);

  useEffect(() => {
    if (transactionResponse !== null) {
      setTransactionInProcess(false);
    }
  }, [transactionResponse]);

  async function submitTransaction(
    functionName: TFunctionName,
    args: [...ModuleNonViewFunctions<TModuleName>[TFunctionName]["args"]],
    tyArgs: string[] = []
  ) {
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::${moduleName.toString()}::${functionName.toString()}`,
        functionArguments: args.map(arg => String(arg)),
      },
    };
    console.log("transaction", transaction);

    setTransactionInProcess(true);
    const signAndSubmitTransactionCall = async (transaction: InputTransactionData): Promise<TransactionResponse> => {
      const responseOnError: TransactionResponseOnError = {
        transactionSubmitted: false,
        message: "Unknown Error",
      };
      let response;
      try {
        response = await signAndSubmitTransaction(transaction);
        // transaction submit succeed
        if (response.hash) {
          await aptos.waitForTransaction({
            transactionHash: response.hash,
            options: {
              checkSuccess: true,
            },
          });

          return {
            transactionSubmitted: true,
            transactionHash: response["hash"],
            success: true,
          };
        }
        // transaction failed
        return { ...responseOnError, message: response.message };
      } catch (error) {
        if (error instanceof FailedTransactionError) {
          return {
            transactionSubmitted: true,
            transactionHash: response ? response.hash : "",
            message: error.message,
            success: false,
          };
        } else if (error instanceof Error) {
          return { ...responseOnError, message: error.message };
        }
      }
      return responseOnError;
    };

    await signAndSubmitTransactionCall(transaction).then(setTransactionResponse);
  }

  function clearTransactionResponse() {
    setTransactionResponse(null);
  }

  return {
    submitTransaction,
    transactionInProcess,
    transactionResponse,
    clearTransactionResponse,
  };
};

export default useSubmitTransaction;

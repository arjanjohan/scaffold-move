import { useEffect, useState } from "react";
import { useGetModule } from "./useGetModule";
import { TransactionResponse as AptosTransactionResponse } from "@aptos-labs/ts-sdk";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosClient } from "~~/hooks/scaffold-move/useAptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { processArguments } from "~~/utils/scaffold-move/arguments";
import { ModuleEntryFunctionNames, ModuleEntryFunctions, ModuleName } from "~~/utils/scaffold-move/module";

export type TransactionResponse = TransactionResponseOnSubmission | TransactionResponseOnError;

// "submission" here means that the transaction is posted on chain and gas is paid.
// However, the status of the transaction might not be "success".
export type TransactionResponseOnSubmission = {
  transactionSubmitted: true;
  transactionHash: string;
  success: boolean; // indicates if the transaction submitted but failed or not
  message?: string; // error message if the transaction failed
  receipt: AptosTransactionResponse; // the transaction as committed on chain
};

export type TransactionResponseOnError = {
  transactionSubmitted: false;
  message: string;
};
const useSubmitTransaction = <TModuleName extends ModuleName>(moduleName: TModuleName) => {
  const [transactionResponse, setTransactionResponse] = useState<TransactionResponse | null>(null);
  const [transactionInProcess, setTransactionInProcess] = useState<boolean>(false);

  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);

  const { signAndSubmitTransaction } = useWallet();

  // Undefined when the module isn't deployed on the target network
  const moduleAddress = useGetModule(moduleName.toString())?.abi.address;

  useEffect(() => {
    if (transactionResponse !== null) {
      setTransactionInProcess(false);
    }
  }, [transactionResponse]);

  async function submitTransaction<TFunctionName extends ModuleEntryFunctionNames<TModuleName>>(
    functionName: TFunctionName,
    args?: ModuleEntryFunctions<TModuleName>[TFunctionName]["args"],
    tyArgs?: ModuleEntryFunctions<TModuleName>[TFunctionName]["tyArgs"],
  ) {
    if (!moduleAddress) {
      setTransactionResponse({
        transactionSubmitted: false,
        message: `Module ${moduleName.toString()} is not deployed on ${network.targetNetwork.name}`,
      });
      return;
    }

    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::${moduleName.toString()}::${functionName.toString()}`,
        typeArguments: tyArgs || [],
        functionArguments: processArguments(args || []),
      },
    };

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
          const receipt = await aptos.waitForTransaction({
            transactionHash: response.hash,
            options: {
              checkSuccess: true,
            },
          });

          return {
            transactionSubmitted: true,
            transactionHash: response.hash,
            success: true,
            receipt,
          };
        }
        // transaction failed
        return { ...responseOnError, message: response.hash };
      } catch (error) {
        // Committed on chain, but the transaction failed. waitForTransaction throws the SDK's
        // FailedTransactionError, which isn't exported, so recognise it by the transaction it carries.
        const failedTransaction = (error as { transaction?: AptosTransactionResponse }).transaction;
        if (error instanceof Error && failedTransaction) {
          return {
            transactionSubmitted: true,
            transactionHash: failedTransaction.hash,
            message: error.message,
            success: false,
            receipt: failedTransaction,
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

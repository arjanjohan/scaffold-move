import {FailedTransactionError} from "aptos";
import {useEffect, useState} from "react";
import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
// import {useGlobalState} from "../../global-config/GlobalConfig";
import { aptosClient } from "~~/utils/scaffold-move/aptosClient";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";



export type TransactionResponse =
  | TransactionResponseOnSubmission
  | TransactionResponseOnError;

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

const useSubmitTransaction = () => {
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionResponse | null>(null);
  const [transactionInProcess, setTransactionInProcess] =
    useState<boolean>(false);
  // const [state] = useGlobalState();



  const network = useTargetNetwork();
  const aptos = aptosClient("devnet");
  const state = {network_value: "https://aptos.devnet.m1.movementlabs.xyz", aptos_client: aptos}

  const {signAndSubmitTransaction} = useWallet();

  useEffect(() => {
    if (transactionResponse !== null) {
      setTransactionInProcess(false);
    }
  }, [transactionResponse]);

  async function submitTransaction(transaction: InputTransactionData) {


    setTransactionInProcess(true);
    console.log("submitting transaction", transaction);
    const signAndSubmitTransactionCall = async (
      transaction: InputTransactionData,
    ): Promise<TransactionResponse> => {
      const responseOnError: TransactionResponseOnError = {
        transactionSubmitted: false,
        message: "Unknown Error",
      };
      let response;
      try {
        response = await signAndSubmitTransaction(transaction);
        console.log("response", response);  

        // transaction submit succeed
        if ("hash" in response) {
          // await state.aptos_client.waitForTransaction(response["hash"], {
          //   checkSuccess: true,
          // });
          
          await state.aptos_client.waitForTransaction(response["hash"]);
          
          return {
            transactionSubmitted: true,
            transactionHash: response["hash"],
            success: true,
          };
        }
        // transaction failed
        return {...responseOnError, message: response.message};
      } catch (error) {
        if (error instanceof FailedTransactionError) {
          return {
            transactionSubmitted: true,
            transactionHash: response ? response.hash : "",
            message: error.message,
            success: false,
          };
        } else if (error instanceof Error) {
          return {...responseOnError, message: error.message};
        }
      }
      return responseOnError;
    };

    await signAndSubmitTransactionCall(transaction).then(
      setTransactionResponse,
    );
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

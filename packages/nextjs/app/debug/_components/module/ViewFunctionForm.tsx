import { useState } from "react";
import { Types } from "aptos";
import { displayTxResult } from "~~/app/debug/_components/module";
import { useAptosClient } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { GenericModuleAbi, MoveFunction } from "~~/utils/scaffold-move/module";

const zeroInputs = false;

type ModuleFormType = {
  typeArgs: string[];
  args: string[];
  ledgerVersion?: string;
};

type FunctionFormProps = {
  module: GenericModuleAbi;
  fn: MoveFunction;
};

export const ViewFunctionForm = ({ module, fn }: FunctionFormProps) => {
  const [viewInProcess, setViewInProcess] = useState(false);
  const [result, setResult] = useState<Types.MoveValue[]>();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ModuleFormType>({ typeArgs: [], args: [] });

  const fnParams = fn.params;

  const network = useTargetNetwork();
  const aptos = useAptosClient(network.targetNetwork.id);

  const handleView = async () => {
    setViewInProcess(true);
    setError(null);

    try {
      const viewResult = await view(
        {
          module_address: module.address,
          module_name: module.name,
          function_name: fn.name,
          ty_args: data.typeArgs,
          function_args: data.args,
        },
        aptos,
      );

      setResult(viewResult);
    } catch (e: any) {
      setError("❌ View request failed: " + e.message);
    } finally {
      setViewInProcess(false);
    }
  };
  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        <p className="font-medium my-0 break-words">{fn.name}</p>
        {fnParams.map((param, i) => (
          <div key={`arg-${i}`} className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center mt-2 ml-2">
              <span className="block text-xs font-extralight leading-none">{`arg${i}:`}</span>
            </div>
            <div className={"flex border-2 border-base-300 bg-base-200 rounded-full text-accent"}>
              <input
                placeholder={param}
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                onChange={e => {
                  const newArgs = [...data.args];
                  newArgs[i] = e.target.value;
                  setData({ ...data, args: newArgs });
                }}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap">
          <div className="flex-grow w-full md:max-w-[80%]">
            {result && (
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
      </div>
    </div>
  );
};

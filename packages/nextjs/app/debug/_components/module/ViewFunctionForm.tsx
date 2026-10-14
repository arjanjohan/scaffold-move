import { useState } from "react";
import { useFunctionArguments } from "./utilFunctionArgs";
import { Types } from "aptos";
import { displayTxResult } from "~~/app/debug/_components/module";
import { useAptosClient } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { view } from "~~/hooks/scaffold-move/useView";
import { processArguments } from "~~/utils/scaffold-move/arguments";
import { GenericModuleAbi, MoveFunction } from "~~/utils/scaffold-move/module";

type FunctionFormProps = {
  module: GenericModuleAbi;
  fn: MoveFunction;
};

export const ViewFunctionForm = ({ module, fn }: FunctionFormProps) => {
  const [viewInProcess, setViewInProcess] = useState(false);
  const [result, setResult] = useState<Types.MoveValue[]>();
  const [error, setError] = useState<string | null>(null);
  const { data, handleTypeArgChange, handleArgChange } = useFunctionArguments(
    fn.generic_type_params.length,
    fn.params.length,
  );

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
          function_args: processArguments(data.args),
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
      <div className={"flex gap-3 flex-col"}>
        <p className="font-medium my-0 wrap-break-word">{fn.name}</p>
        {/* Type Arguments */}
        {data.typeArgs.map((_, i) => (
          <div key={`type-arg-${i}`} className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center mt-2 ml-2">
              <span className="block text-xs font-extralight leading-none">{`T${i}:`}</span>
            </div>
            <div className={"flex border-2 border-base-300 bg-base-200 text-base-content"}>
              <input
                placeholder={`Type Argument ${i}`}
                className="input input-ghost focus-within:border-transparent focus:outline-hidden focus:bg-transparent focus:text-base-content h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-base-content/60 text-base-content"
                onChange={e => handleTypeArgChange(i, e.target.value)}
              />
            </div>
          </div>
        ))}
        {/* Function Arguments */}
        {fn.params.map((param, i) => (
          <div key={`arg-${i}`} className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center mt-2 ml-2">
              <span className="block text-xs font-extralight leading-none">{`arg${i}:`}</span>
            </div>
            <div className={"flex border-2 border-base-300 bg-base-200 text-base-content"}>
              <input
                placeholder={param}
                className="input input-ghost focus-within:border-transparent focus:outline-hidden focus:bg-transparent focus:text-base-content h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-base-content/60 text-base-content"
                onChange={e => handleArgChange(i, e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap">
          <div className="grow w-full md:max-w-[80%]">
            {result && (
              <div className="bg-base-300 text-sm px-4 py-1.5 wrap-break-word overflow-auto">
                <p className="font-bold m-0 mb-1">Result:</p>
                <pre className="whitespace-pre-wrap wrap-break-word">{displayTxResult(result, "sm")}</pre>
              </div>
            )}
            {error && (
              <div className="bg-error text-error-content text-sm px-4 py-1.5 wrap-break-word overflow-auto">
                <p className="font-bold m-0 mb-1">Error:</p>
                <pre className="whitespace-pre-wrap wrap-break-word">{error}</pre>
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

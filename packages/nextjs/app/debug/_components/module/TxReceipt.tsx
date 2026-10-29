import { TransactionResponse } from "@aptos-labs/ts-sdk";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ObjectFieldDisplay } from "~~/app/debug/_components/module";
import { useCopyToClipboard } from "~~/hooks/scaffold-move";
import { replacer } from "~~/utils/scaffold-move/common";

// Fields shown in the receipt. The copy button copies the full transaction, including its write set.
const receiptFields = new Set([
  "hash",
  "version",
  "success",
  "vm_status",
  "gas_used",
  "gas_unit_price",
  "sender",
  "sequence_number",
  "timestamp",
  "events",
]);

export const TxReceipt = ({ txResult }: { txResult: TransactionResponse }) => {
  const { copyToClipboard, isCopiedToClipboard } = useCopyToClipboard();
  const receipt = Object.entries(txResult).filter(([key]) => receiptFields.has(key));

  return (
    <div className="flex text-sm min-h-0 bg-base-300 py-0">
      <div className="mt-1 pl-2">
        <button
          type="button"
          className="ml-1.5 cursor-pointer"
          aria-label={isCopiedToClipboard ? "Transaction copied" : "Copy transaction"}
          onClick={() => copyToClipboard(JSON.stringify(txResult, replacer, 2))}
        >
          {isCopiedToClipboard ? (
            <CheckCircleIcon className="text-xl font-normal text-accent h-5 w-5" aria-hidden="true" />
          ) : (
            <DocumentDuplicateIcon className="text-xl font-normal text-accent h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      <div className="flex-wrap collapse collapse-arrow">
        <input type="checkbox" className="min-h-0 peer" />
        {/* daisyUI places the arrow for a taller title; center it (closed it sits above its top, open on it) */}
        <div className="collapse-title text-sm min-h-0 py-1.5 pl-1 after:top-[calc(50%+0.25rem)]! peer-checked:after:top-1/2!">
          <strong>Transaction Receipt</strong>
        </div>
        <div className="collapse-content overflow-auto bg-base-300 pl-0!">
          <pre className="text-xs">
            {receipt.map(([k, v]) => (
              <ObjectFieldDisplay name={k} value={v} size="xs" leftPad={false} key={k} />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

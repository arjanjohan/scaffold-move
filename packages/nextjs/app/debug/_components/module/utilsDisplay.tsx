import { ReactElement } from "react";
import { Address } from "~~/components/scaffold-move";
import { replacer } from "~~/utils/scaffold-move/common";

type DisplayContent = string | number | bigint | boolean | Record<string, any> | undefined | unknown;

type ResultFontSize = "sm" | "base" | "xs" | "lg" | "xl" | "2xl" | "3xl";

export const displayTxResult = (
  displayContent: DisplayContent | DisplayContent[],
  fontSize: ResultFontSize = "base",
): string | ReactElement | number => {
  if (displayContent == null) {
    return "";
  }

  if (typeof displayContent === "bigint") {
    return displayContent.toString();
  }

  if (typeof displayContent === "string") {
    // Long-form account address (0x + 64 hex characters)
    if (/^0x[0-9a-fA-F]{64}$/.test(displayContent)) {
      return <Address address={displayContent} size={fontSize} />;
    }

    // u64/u128/u256 values come as numeric strings, vector<u8> and short addresses as hex: don't add quotes
    if (/^\d+$/.test(displayContent) || /^0x[0-9a-fA-F]*$/.test(displayContent)) {
      return displayContent;
    }
  }

  if (Array.isArray(displayContent)) {
    return <ArrayDisplay values={displayContent} size={fontSize} />;
  }

  if (typeof displayContent === "object") {
    return <StructDisplay struct={displayContent} size={fontSize} />;
  }

  return JSON.stringify(displayContent, replacer, 2);
};

export const ObjectFieldDisplay = ({
  name,
  value,
  size,
  leftPad = true,
}: {
  name: string;
  value: DisplayContent;
  size: ResultFontSize;
  leftPad?: boolean;
}) => {
  return (
    <div className={`flex flex-row items-baseline ${leftPad ? "ml-4" : ""}`}>
      <span className="text-base-content/60 mr-2">{name}:</span>
      <span className="text-base-content">{displayTxResult(value, size)}</span>
    </div>
  );
};

const ArrayDisplay = ({ values, size }: { values: DisplayContent[]; size: ResultFontSize }) => {
  return (
    <div className="flex flex-col gap-y-1">
      {values.length ? "array" : "[]"}
      {values.map((v, i) => (
        <ObjectFieldDisplay key={i} name={`[${i}]`} value={v} size={size} />
      ))}
    </div>
  );
};

const StructDisplay = ({ struct, size }: { struct: Record<string, any>; size: ResultFontSize }) => {
  return (
    <div className="flex flex-col gap-y-1">
      struct
      {Object.entries(struct).map(([k, v]) => (
        <ObjectFieldDisplay key={k} name={k} value={v} size={size} />
      ))}
    </div>
  );
};

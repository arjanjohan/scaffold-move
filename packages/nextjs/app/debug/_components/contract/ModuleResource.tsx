import dynamic from "next/dynamic";
import { Types } from "aptos";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

type ModuleResourceProps = {
  key: number;
  resource: Types.MoveResource;
  collapsedByDefault: boolean;
};

const GROUP_ARRAYS_AFTER_LENGTH = 100;
const COLLAPSE_STRINGS_AFTER_LENGTH = 80;

export const ModuleResource = ({ key, resource, collapsedByDefault }: ModuleResourceProps) => {
  return (
    <>
      <div>{resource.type}</div>
      <DynamicReactJson
        key={key}
        src={resource.data}
        collapseStringsAfterLength={COLLAPSE_STRINGS_AFTER_LENGTH}
        displayObjectSize={false}
        displayDataTypes={false}
        quotesOnKeys={false}
        groupArraysAfterLength={GROUP_ARRAYS_AFTER_LENGTH}
        collapsed={collapsedByDefault}
      />
    </>
  );
};

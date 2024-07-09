import { Types } from "aptos";
import ReactJson from "react-json-view";

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
      <ReactJson
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

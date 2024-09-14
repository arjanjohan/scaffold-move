import dynamic from "next/dynamic";
import { Types } from "aptos";

const DynamicReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface ModuleResourceProps {
  resource: Types.MoveResource;
  collapsedByDefault: boolean;
}

const GROUP_ARRAYS_AFTER_LENGTH = 100;
const COLLAPSE_STRINGS_AFTER_LENGTH = 80;

export const ModuleResource = ({ resource, collapsedByDefault }: ModuleResourceProps) => (
  <div>
    <div>{resource.type}</div>
    <DynamicReactJson
      src={resource.data}
      collapseStringsAfterLength={COLLAPSE_STRINGS_AFTER_LENGTH}
      displayObjectSize={false}
      displayDataTypes={false}
      quotesOnKeys={false}
      groupArraysAfterLength={GROUP_ARRAYS_AFTER_LENGTH}
      collapsed={collapsedByDefault}
    />
  </div>
);

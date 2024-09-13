import { AbiParameter } from "abitype";
import { Types } from "aptos";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedModulesData from "~~/contracts/deployedModules";
import externalModulesData from "~~/contracts/externalModules";
import scaffoldConfig from "~~/scaffold.config";

type AddExternalFlag<T> = {
  [ChainId in keyof T]: {
    [ContractName in keyof T[ChainId]]: T[ChainId][ContractName] & { external?: true };
  };
} 
// Added this index signature to allow for flexibility with key types
// TODO: Figure out how to properly handle this
& {
  [key: string]: any; 
};

const deepMergeContracts = <L extends Record<PropertyKey, any>, E extends Record<PropertyKey, any>>(
  local: L,
  external: E,
) => {
  const result: Record<PropertyKey, any> = {};
  const allKeys = Array.from(new Set([...Object.keys(external), ...Object.keys(local)]));
  for (const key of allKeys) {
    if (!external[key]) {
      result[key] = local[key];
      continue;
    }
    const amendedExternal = Object.fromEntries(
      Object.entries(external[key] as Record<string, Record<string, unknown>>).map(([contractName, declaration]) => [
        contractName,
        { ...declaration, external: true },
      ]),
    );
    result[key] = { ...local[key], ...amendedExternal };
  }
  return result as MergeDeepRecord<AddExternalFlag<L>, AddExternalFlag<E>, { arrayMergeMode: "replace" }>;
};

const modulesData = deepMergeContracts(deployedModulesData, externalModulesData);

export type GenericContract = {
  bytecode: string;
  abi: GenericContractAbi;
};

export type GenericContractAbi = {
  address: Types.Address;
  name: string;
  friends: readonly string[];
  exposed_functions: readonly MoveFunction[];
  structs: readonly MoveStruct[];
};


type MoveFunction = {
  name: string;
  visibility: string;
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: readonly MoveFunctionGenericTypeParam[];
  params: readonly string[];
  return: readonly string[];
};

type MoveFunctionGenericTypeParam = {
  constraints: readonly string[];
};

type MoveStruct = {
  name: string;
  is_native: boolean;
  abilities: readonly string[];
  generic_type_params: readonly MoveStructGenericTypeParam[];
  fields: readonly MoveStructField[];
};

type MoveStructGenericTypeParam = {
  constraints: readonly string[];
};


type MoveStructField = {
  name: string;
  type: string;
};

export type GenericContractsDeclaration = {
  [chainId: string]: {
    [contractName: string]: GenericContract;
  };
};

export const contracts = deployedModulesData as GenericContractsDeclaration | null;

type ConfiguredChainId = (typeof scaffoldConfig)["targetNetworks"][0]["id"];

type IsContractDeclarationMissing<TYes, TNo> = typeof modulesData extends { [key in ConfiguredChainId]: any }
  ? TNo
  : TYes;

type ContractsDeclaration = IsContractDeclarationMissing<GenericContractsDeclaration, typeof modulesData>;

type Contracts = ContractsDeclaration[ConfiguredChainId]; // TODO: hardcoded value

export type ContractName = keyof Contracts;
export type Contract<TContractName extends ContractName> = Contracts[TContractName];

export enum ContractCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
}

export type AbiParameterTuple = Extract<AbiParameter, { type: "tuple" | `tuple[${string}]` }>;

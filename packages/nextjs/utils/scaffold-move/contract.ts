import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedContractsData from "~~/contracts/deployedModules";
import externalContractsData from "~~/contracts/externalModules";
import scaffoldConfig from "~~/scaffold.config";


type AddExternalFlag<T> = {
  [ChainId in keyof T]: {
    [ContractName in keyof T[ChainId]]: T[ChainId][ContractName] & { external?: true };
  };
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

const contractsData = deepMergeContracts(deployedContractsData, externalContractsData);

type MoveFunction = {
  name: string;
  visibility: string;
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: any[];
  params: string[];
  return: string[];
};

type MoveStructField = {
  name: string;
  type: string;
};

type MoveStruct = {
  name: string;
  is_native: boolean;
  abilities: string[];
  generic_type_params: any[];
  fields: MoveStructField[];
};

export type GenericContract = {
  bytecode: string;
  abi?: GenericContractAbi;
  external?: true;
};

export type GenericContractAbi = {
  address: string; // TODO: address type
  name: string;
  friends: string[]; //TODO: check which type?
  exposed_functions: MoveFunction[];
  structs: MoveStruct[];
}

export type GenericContractsDeclaration = {
  [chainId: string]: {
    [contractName: string]: GenericContract;
  };
};

export const contracts = contractsData as GenericContractsDeclaration | null;


type ConfiguredChainId = (typeof scaffoldConfig)["targetNetworks"][0]["id"];

type IsContractDeclarationMissing<TYes, TNo> = typeof contractsData extends { [key in ConfiguredChainId]: any }
  ? TNo
  : TYes;

type ContractsDeclaration = IsContractDeclarationMissing<GenericContractsDeclaration, typeof contractsData>;

type Contracts = ContractsDeclaration[ConfiguredChainId];


export type ContractName = keyof Contracts;
export type Contract<TContractName extends ContractName> = Contracts[TContractName];



export enum ContractCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
}
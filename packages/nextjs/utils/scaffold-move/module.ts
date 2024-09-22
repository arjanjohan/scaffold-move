import { AbiParameter } from "abitype";
import { Types } from "aptos";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedModulesData from "~~/modules/deployedModules";
import externalModulesData from "~~/modules/externalModules";

// import scaffoldConfig from "~~/scaffold.config";

type AddExternalFlag<T> = {
  [ChainId in keyof T]: {
    [ModuleName in keyof T[ChainId]]: T[ChainId][ModuleName] & { external?: true };
  };
};

const deepMergeModules = <L extends Record<PropertyKey, any>, E extends Record<PropertyKey, any>>(
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
      Object.entries(external[key] as Record<string, Record<string, unknown>>).map(([moduleName, declaration]) => [
        moduleName,
        { ...declaration, external: true },
      ]),
    );
    result[key] = { ...local[key], ...amendedExternal };
  }
  return result as MergeDeepRecord<AddExternalFlag<L>, AddExternalFlag<E>, { arrayMergeMode: "replace" }>;
};

const modulesData = deepMergeModules(deployedModulesData, externalModulesData);

export type GenericModule = {
  bytecode: string;
  abi: GenericModuleAbi;
  external?: true;
};

export type GenericModuleAbi = {
  address: Types.Address;
  name: string;
  friends: readonly string[];
  exposed_functions: readonly MoveFunction[];
  structs: readonly MoveStruct[];
};

export type MoveFunction = {
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

export type GenericModulesDeclaration = {
  [chainId: number]: {
    [moduleName: string]: GenericModule;
  };
};

export const modules = modulesData as GenericModulesDeclaration | null;

// type ConfiguredChainId = (typeof scaffoldConfig)["targetNetworks"][0]["id"];
type ConfiguredChainId = 0;

type IsModuleDeclarationMissing<TYes, TNo> = typeof modulesData extends { [key in ConfiguredChainId]: any }
  ? TNo
  : TYes;

type ModulesDeclaration = IsModuleDeclarationMissing<GenericModulesDeclaration, typeof modulesData>;

type Modules = ModulesDeclaration[ConfiguredChainId];

export type ModuleName = keyof Modules;
export type Module<TModuleName extends ModuleName> = Modules[TModuleName];

export enum ModuleCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
}

export type AbiParameterTuple = Extract<AbiParameter, { type: "tuple" | `tuple[${string}]` }>;

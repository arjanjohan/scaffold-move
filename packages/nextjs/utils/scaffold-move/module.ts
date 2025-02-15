import { AbiParameter } from "abitype";
import { Types } from "aptos";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedModulesData from "~~/modules/deployedModules";
import externalModulesData from "~~/modules/externalModules";
import latestChainId from "~~/modules/latestChainId";
// import scaffoldConfig from "~~/scaffold.config";

// Helper type to create a tuple of any type with specific length
type TupleOfLength<L extends number, T = any> = [T, ...T[]] & { length: L };

// Add these debug types
type MoveBaseTypes = {
  "0x1::string::String": string;
  address: `0x${string}`;
  bool: boolean;
  u8: number;
  u16: number;
  u32: number;
  u64: number;
  u128: number;
  u256: number;
};

// Helper type to extract function parameters from Move parameter strings
type ExtractMoveParam<T extends string> = T extends "&signer"
  ? never
  : T extends keyof MoveBaseTypes
    ? MoveBaseTypes[T]
    : T extends `vector<${infer Inner}>`
      ? ExtractMoveParam<Inner>[]
      : T extends `0x1::object::Object<${string}>`
        ? `0x${string}`
        : T extends `0x1::option::Option<${infer Inner}>`
          ? ExtractMoveParam<Inner> | null
          : unknown;

export type FilterNever<T extends readonly any[]> = T extends readonly [infer First, ...infer Rest]
  ? ExtractMoveParam<First & string> extends never
    ? FilterNever<Rest>
    : [ExtractMoveParam<First & string>, ...FilterNever<Rest>]
  : [];

type ExtractMoveParams<T extends readonly string[]> = FilterNever<T>;

// Helper type to extract function return types from Move return strings
type ExtractMoveReturns<T extends readonly string[]> = {
  [K in keyof T]: ExtractMoveParam<T[K] & string>;
};

// Get all modules for a specific chain
export type ChainModules = (typeof modulesData)[ConfiguredChainId];

// Get all view functions for a module
type ViewFunctions<TModule extends GenericModule> = {
  [K in TModule["abi"]["exposed_functions"][number]["name"] as Extract<
    TModule["abi"]["exposed_functions"][number],
    { name: K }
  >["is_view"] extends true
    ? K
    : never]: Extract<TModule["abi"]["exposed_functions"][number], { name: K; is_view: true }> extends infer F extends
    MoveFunction
    ? {
        args: ExtractMoveParams<F["params"]>;
        tyArgs: F["generic_type_params"] extends readonly MoveFunctionGenericTypeParam[]
          ? F["generic_type_params"]["length"] extends 0
            ? []
            : TupleOfLength<F["generic_type_params"]["length"]>
          : never;
        returns: ExtractMoveReturns<F["return"]>;
      }
    : never;
};

// Get all view functions for a specific module
export type ModuleViewFunctions<TModuleName extends keyof ChainModules> = ViewFunctions<
  Extract<ChainModules[TModuleName], GenericModule>
>;

// Get function names that are view functions
export type ModuleViewFunctionNames<TModuleName extends keyof ChainModules> = keyof ModuleViewFunctions<TModuleName>;

// Get all non-view functions for a module
type NonViewFunctions<TModule extends GenericModule> = {
  [K in TModule["abi"]["exposed_functions"][number]["name"] as Extract<
    TModule["abi"]["exposed_functions"][number],
    { name: K }
  >["is_view"] extends false
    ? K
    : never]: Extract<TModule["abi"]["exposed_functions"][number], { name: K; is_view: false }> extends infer F extends
    MoveFunction
    ? {
        args: ExtractMoveParams<F["params"]>;
        tyArgs: F["generic_type_params"] extends readonly MoveFunctionGenericTypeParam[]
          ? F["generic_type_params"]["length"] extends 0
            ? []
            : TupleOfLength<F["generic_type_params"]["length"]>
          : never;
        returns: ExtractMoveReturns<F["return"]>;
      }
    : never;
};

// Get all non-view functions for a specific module
export type ModuleNonViewFunctions<TModuleName extends keyof ChainModules> = NonViewFunctions<
  Extract<ChainModules[TModuleName], GenericModule>
>;

// Get function names that are non-view functions
export type ModuleNonViewFunctionNames<TModuleName extends keyof ChainModules> =   keyof ModuleNonViewFunctions<TModuleName>;

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

// TODO: Figure out why getting the chainId from config is not working.
// type ConfiguredChainId = (typeof scaffoldConfig)["targetNetworks"][0]["id"];
type ConfiguredChainId = typeof latestChainId;

type IsModuleDeclarationMissing<TYes, TNo> = typeof modulesData extends { [key in ConfiguredChainId]: any }
  ? TNo
  : TYes;

export type ModulesDeclaration = IsModuleDeclarationMissing<GenericModulesDeclaration, typeof modulesData>;

type Modules = ModulesDeclaration[ConfiguredChainId];

export type ModuleName = keyof Modules;
export type Module<TModuleName extends ModuleName> = Modules[TModuleName];

export enum ModuleCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
}

export type AbiParameterTuple = Extract<AbiParameter, { type: "tuple" | `tuple[${string}]` }>;

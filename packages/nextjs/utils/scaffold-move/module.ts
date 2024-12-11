import { AbiParameter } from "abitype";
import type { MoveAbility, MoveFunctionVisibility } from "@aptos-labs/ts-sdk";
import { Types } from "aptos";
import { UseReadContractParameters } from "khizab";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedModulesData from "~~/modules/deployedModules";
import externalModulesData from "~~/modules/externalModules";
import scaffoldConfig from "~~/scaffold.config";
import type { ExtractAbiFunction, ExtractAbiFunctionNames } from "~~/utils/scaffold-move/abi";

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
  visibility: MoveFunctionVisibility[keyof MoveFunctionVisibility];
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
  abilities: readonly MoveAbility[keyof MoveAbility][];
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

export type IsModuleDeclarationMissing<TYes, TNo> = typeof modulesData extends { [key in ConfiguredChainId]: any }
  ? TNo
  : TYes;

type ModulesDeclaration = IsModuleDeclarationMissing<GenericModulesDeclaration, typeof modulesData>;

type Modules = ModulesDeclaration[ConfiguredChainId];

export type ModuleName = keyof Modules;
export type Module<TModuleName extends ModuleName> = Modules[TModuleName];

type InferModuleAbi<TModule> = TModule extends { abi: infer TAbi } ? TAbi : never;

export type ModuleAbi<TModuleName extends ModuleName = ModuleName> = InferModuleAbi<Module<TModuleName>>;

export enum ModuleCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
}

export type FunctionNamesWithInputs<TModuleName extends ModuleName> = Exclude<
  Extract<
    ModuleAbi<TModuleName>,
    {
      type: "function";
    }
  >,
  {
    inputs: readonly [];
  }
>["name"];

type Expand<T> = T extends object ? (T extends infer O ? { [K in keyof O]: O[K] } : never) : T;

type UnionToIntersection<U> = Expand<(U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never>;

type OptionalTuple<T> = T extends readonly [infer H, ...infer R] ? readonly [H | undefined, ...OptionalTuple<R>] : T;

export type AbiFunctionInputs<TAbi extends GenericModuleAbi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["params"];

// export type AbiFunctionArguments<TAbi extends GenericModuleAbi, TFunctionName extends string> = AbiParametersToPrimitiveTypes<
//   AbiFunctionInputs<TAbi, TFunctionName>
// >;

// type UseScaffoldArgsParam<
//   TModuleName extends ModuleName,
//   TFunctionName extends ExtractAbiFunctionNames<ModuleAbi<TModuleName>>,
// > =
//   TFunctionName extends FunctionNamesWithInputs<TModuleName>
//     ? {
//         args: OptionalTuple<UnionToIntersection<AbiFunctionArguments<ModuleAbi<TModuleName>, TFunctionName>>>;
//       }
//     : {
//         args?: never;
//       };

export type UseViewConfig<
  TModuleName extends ModuleName,
  TFunctionName extends ExtractAbiFunctionNames<ModuleAbi<TModuleName>>,
> = {
  moduleName: TModuleName;
  functionName: string;
  args?: any[];
  tyArgs?: string[];
  watch?: boolean;
}
;
// & IsModuleDeclarationMissing<
//   Partial<UseReadContractParameters>,
//   {
//     functionName: TFunctionName;
//   } & UseScaffoldArgsParam<TModuleName, TFunctionName> &
//     Omit<UseReadContractParameters, "chainId" | "abi" | "address" | "functionName" | "args">
// >;

export type AbiParameterTuple = Extract<AbiParameter, { type: "tuple" | `tuple[${string}]` }>;

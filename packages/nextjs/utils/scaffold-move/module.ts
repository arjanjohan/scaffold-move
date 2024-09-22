import { AbiParameter } from "abitype";
import { Types } from "aptos";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedModulesData from "~~/modules/deployedModules";
import externalModulesData from "~~/modules/externalModules";
import scaffoldConfig from "~~/scaffold.config";

const modulesData = deployedModulesData;

export type GenericModule = {
  bytecode: string;
  // abi: GenericModuleAbi;
};

export type GenericModulesDeclaration = {
  [chainId: number]: {
    [moduleName: string]: GenericModule;
  };
};

export const modules = deployedModulesData as GenericModulesDeclaration | null;

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

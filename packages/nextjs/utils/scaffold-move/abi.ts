
import {
  AbiParameter,
  AbiParameterToPrimitiveType,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  AbiParameterKind,
} from "abitype";
import { GenericModuleAbi } from "./module";

/**
 * Extracts all {@link AbiFunction} types from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract functions from
 * @param abiStateMutability - {@link AbiStateMutability} to filter by
 * @returns All {@link AbiFunction} types from {@link Abi}
 */
export type ExtractAbiFunctions<abi extends GenericModuleAbi> = abi["exposed_functions"][number];

/**
 * Extracts all {@link AbiFunction} names from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract function names from
 * @param abiStateMutability - {@link AbiStateMutability} to filter by
 * @returns Union of function names
 */
export type ExtractAbiFunctionNames<abi extends GenericModuleAbi> = ExtractAbiFunctions<abi>["name"];

/**
 * Extracts {@link AbiFunction} with name from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract {@link AbiFunction} from
 * @param functionName - String name of function to extract from {@link Abi}
 * @param abiStateMutability - {@link AbiStateMutability} to filter by
 * @returns Matching {@link AbiFunction}
 */
export type ExtractAbiFunction<
  abi extends GenericModuleAbi,
  functionName extends ExtractAbiFunctionNames<abi>,
> = Extract<ExtractAbiFunctions<abi>, { name: functionName }>;

import { GenericContractsDeclaration } from "~~/utils/scaffold-move/contract";

const deployedModules = {
  "devnet": {
  }
} as const;

export default deployedModules satisfies GenericContractsDeclaration;
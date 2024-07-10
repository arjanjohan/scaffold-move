import { GenericContractsDeclaration } from "~~/utils/scaffold-move/contract";

const externalModules = {
  "devnet": {
  }
} as const;

export default externalModules satisfies GenericContractsDeclaration;
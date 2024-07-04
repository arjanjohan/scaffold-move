import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/utils/scaffold-move/contract";

export function getAllContracts() {
  const contractsData = contracts?.["devnet"];
  return contractsData ? contractsData : {};
}

import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/utils/scaffold-move/contract";

export function getAllContracts() {
  const contractsData = contracts?.["testnet"]; // TODO: hardcoded value
  return contractsData ? contractsData : {};
}
 
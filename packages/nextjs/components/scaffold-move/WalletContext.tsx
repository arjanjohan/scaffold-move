import { ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return <AptosWalletAdapterProvider autoConnect={true}>{children}</AptosWalletAdapterProvider>;
};

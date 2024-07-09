import { ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallets = [new PetraWallet()];
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

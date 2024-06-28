import { ReactNode, createContext, useContext } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallets = [new PetraWallet()];
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const useAptosWallet = () => {
  return useContext(WalletContext);
};

import { ReactNode } from "react";
import { AptosWalletAdapterProvider, AvailableWallets } from "@aptos-labs/wallet-adapter-react";

// "Petra Web" is the adapter's default; Pontem fails network switching and transactions in this app.
// The cast is needed because the adapter's wallet-name type doesn't list Pontem.
const hideWallets = ["Petra Web", "Pontem Wallet"] as AvailableWallets[];

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AptosWalletAdapterProvider autoConnect={true} hideWallets={hideWallets}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

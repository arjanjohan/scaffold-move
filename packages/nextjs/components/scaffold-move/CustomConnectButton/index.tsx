"use client";

import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WalletSelector } from "./WalletSelector";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useWallet } from "@scaffold-move/wallet-adapter-react";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-move";

export const CustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();

  const { account, connected, network } = useWallet();

  const blockExplorerAddressLink = account
    ? getBlockExplorerAddressLink(targetNetwork, account?.address?.toString())
    : undefined;

  return (
    <>
      {!connected ? (
        <WalletSelector />
      ) : Number(network?.chainId) !== targetNetwork.id ? (
        <WrongNetworkDropdown />
      ) : (
        <>
          <div className="flex flex-col items-center mr-1">
            <Balance address={account?.address?.toString() || ""} />
            <span className="text-xs">{targetNetwork ? targetNetwork.name : "Loading..."}</span>
          </div>
          <AddressInfoDropdown
            address={account?.address?.toString() || ""}
            // ensAvatar={""} // Update this with ENS Avatar if available
            blockExplorerAddressLink={blockExplorerAddressLink}
          />
          <AddressQRCodeModal address={account?.address?.toString() || ""} modalId="qrcode-modal" />
        </>
      )}
    </>
  );
};

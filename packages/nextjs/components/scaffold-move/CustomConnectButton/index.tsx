"use client";

import { useEffect, useState } from "react";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";


import {
  useWallet
} from "@aptos-labs/wallet-adapter-react";

export const CustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  // const [account, setAccount] = useState(null);
  const chain = {name: "devnet"}; // TODO: replace


  const { account, connected} = useWallet();


  const blockExplorerAddressLink = account ? getBlockExplorerAddressLink(targetNetwork, account?.address) : undefined;

  return (
    <>
      {!connected ? (
        <div className="flex flex-col items-center mr-1 btn btn-primary">
        <WalletSelector />
        </div>
      ) 
      // : chainId !== targetNetwork.id ? (
      //   <WrongNetworkDropdown />
      // )
       : (
        <>
          <div className="flex flex-col items-center mr-1">
            {/* <Balance address={account} className="min-h-0 h-auto" /> */}
            <span className="text-xs">{chain ? chain.name : "Loading..."}</span>
          </div>
          <AddressInfoDropdown
            address={account?.address || ""}
            displayName={account?.address || ""}
            ensAvatar={""} // Update this with ENS Avatar if available
            blockExplorerAddressLink={blockExplorerAddressLink}
          />
        </>
      )}
    </>
  );
};
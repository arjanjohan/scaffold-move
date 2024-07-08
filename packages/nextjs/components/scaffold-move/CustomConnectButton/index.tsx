"use client";

import { useEffect, useState } from "react";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

export const CustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const chain = {name: "devnet"}; // TODO: replace



  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
  };

  const connectWallet = async () => {
    try {
      // const accounts = await provider.send("eth_requestAccounts", []);
      // setAccount(accounts[0]);
      // const network = await provider.getNetwork();
      // setChainId(network.chainId);
    } catch (error) {
      console.error(error);
    }
  };

  const blockExplorerAddressLink = account ? getBlockExplorerAddressLink(targetNetwork, account) : undefined;
  const connected = account && chainId;

  return (
    <>
      {/* {!connected ? (
        <button className="btn btn-primary btn-sm" onClick={connectWallet} type="button">
          Connect Wallet
        </button>
      ) : chainId !== targetNetwork.id ? (
        <WrongNetworkDropdown />
      ) : ( */}
        <>
          <div className="flex flex-col items-center mr-1">
            {/* <Balance address={account} className="min-h-0 h-auto" /> */}
            <span className="text-xs">{chain ? chain.name : "Loading..."}</span>
          </div>
          <AddressInfoDropdown
            address="account"
            displayName="{account}"
            // ensAvatar={null} // Update this with ENS Avatar if available
            blockExplorerAddressLink={blockExplorerAddressLink}
          />
        </>
      {/* )} */}
    </>
  );
};

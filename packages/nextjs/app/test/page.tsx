"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { useAptosClient, useDeployedModuleInfo } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";


const TestPage: NextPage = () => {
  const { account } = useWallet();
  const network = useTargetNetwork();
  const chainId = network.targetNetwork.id;
  const aptos = useAptosClient(chainId);
  
  const existingMoveModule = useDeployedModuleInfo("onchain_bio");
  const notExistingMoveModule = useDeployedModuleInfo("fake_module_name");

  return (
    <></>
  );
};

export default TestPage;

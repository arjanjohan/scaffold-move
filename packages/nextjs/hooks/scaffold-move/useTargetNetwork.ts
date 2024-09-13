import { useEffect } from "react";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { Chain } from "~~/utils/scaffold-move/chains";
import { useWallet } from "@aptos-labs/wallet-adapter-react";


/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: Chain } {
  const {network} = useWallet();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === network?.chainId);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  }, [network, setTargetNetwork, targetNetwork.id]);

  return { targetNetwork };
}

// Import your notification utility
import { Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { getTargetNetworks } from "~~/utils/scaffold-move";
import { notification } from "~~/utils/scaffold-move/notification";

const allowedNetworks = getTargetNetworks();

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps) => {
  const { network, changeNetwork } = useWallet();

  const handleNetworkChange = async (allowedNetwork: any) => {
    try {
      await changeNetwork(allowedNetwork.network);
      notification.success(`Successfully switched to ${allowedNetwork.name}`);
    } catch (error) {
      notification.error(`Failed to switch network: ${error}`);
    }
  };

  return (
    <>
      {allowedNetworks
        .filter(allowedNetwork => allowedNetwork.id !== Number(network?.chainId))
        .map(allowedNetwork => {
          const isCustomNetwork = allowedNetwork.network === Network.CUSTOM;

          return (
            <li key={allowedNetwork.id} className={hidden ? "hidden" : ""}>
              <button
                className={`menu-item btn-sm !rounded-xl flex gap-3 py-3 whitespace-nowrap ${isCustomNetwork ? "opacity-50 cursor-not-allowed" : ""}`}
                type="button"
                onClick={() => !isCustomNetwork && handleNetworkChange(allowedNetwork)}
                disabled={isCustomNetwork}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
                <span>
                  Switch to <span>{allowedNetwork.name}</span>
                </span>
              </button>
            </li>
          );
        })}
    </>
  );
};

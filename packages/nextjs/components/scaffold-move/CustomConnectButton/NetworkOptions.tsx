// Import your notification utility
import { Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import { Chain } from "@scaffold-move/common";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { getTargetNetworks } from "~~/utils/scaffold-move";
import { notification } from "~~/utils/scaffold-move/notification";

const allowedNetworks = getTargetNetworks();

// Petra rejects network changes from the app (with an empty error). Switching in Petra works, and the app follows.
export const isNetworkSwitchingDisabled = (walletName?: string) => walletName === "Petra";

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps) => {
  const { network, wallet, changeNetwork } = useWallet();
  const switchingDisabled = isNetworkSwitchingDisabled(wallet?.name);

  const handleNetworkChange = async (allowedNetwork: Chain) => {
    try {
      if (allowedNetwork.network === "custom") {
        // The adapter's changeNetwork only knows Aptos networks, so ask the wallet directly
        const changeNetworkFeature = wallet?.features["aptos:changeNetwork"];
        if (!changeNetworkFeature) {
          throw new Error(`${wallet?.name} does not support changing network`);
        }
        const response = await changeNetworkFeature.changeNetwork({
          name: Network.CUSTOM,
          chainId: allowedNetwork.id,
          url: allowedNetwork.fullnode,
        });
        if (response.status === UserResponseStatus.REJECTED) {
          throw new Error("User rejected the request");
        }
      } else {
        await changeNetwork(NetworkToNetworkName[allowedNetwork.network]);
      }
      notification.success(`Successfully switched to ${allowedNetwork.name}`);
    } catch (error) {
      // The adapter rethrows only the wallet's error message, which can be empty
      console.error("Failed to switch network", error);
      notification.error(`Failed to switch network: ${error || "unknown error"}`);
    }
  };

  return (
    <>
      {allowedNetworks
        .filter(allowedNetwork => allowedNetwork.id !== Number(network?.chainId))
        .map(allowedNetwork => (
          <li key={allowedNetwork.id} className={hidden ? "hidden" : ""}>
            <button
              className={`menu-item btn-sm flex gap-3 py-3 whitespace-nowrap ${
                switchingDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="button"
              onClick={() => handleNetworkChange(allowedNetwork)}
              disabled={switchingDisabled}
            >
              <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span>
                Switch to <span>{allowedNetwork.name}</span>
              </span>
            </button>
          </li>
        ))}
    </>
  );
};

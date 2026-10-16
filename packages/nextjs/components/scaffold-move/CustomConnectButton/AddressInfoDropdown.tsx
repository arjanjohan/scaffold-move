import { useRef, useState } from "react";
import { NetworkOptions, isNetworkSwitchingDisabled } from "./NetworkOptions";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-move";
import { useAptosClient, useCopyToClipboard, useOutsideClick } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { getTargetNetworks } from "~~/utils/scaffold-move";
import { notification } from "~~/utils/scaffold-move/notification";

const allowedNetworks = getTargetNetworks();

const FAUCET_AMOUNT = 100_000_000; // 1 MOVE / APT (8 decimals)

type AddressInfoDropdownProps = {
  address: string;
  blockExplorerAddressLink: string | undefined;
};

export const AddressInfoDropdown = ({ address, blockExplorerAddressLink }: AddressInfoDropdownProps) => {
  const { copyToClipboard, isCopiedToClipboard } = useCopyToClipboard();
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const { targetNetwork } = useTargetNetwork();
  const aptos = useAptosClient(targetNetwork.id);
  const queryClient = useQueryClient();
  const [isFunding, setIsFunding] = useState(false);
  const symbol = targetNetwork.native_token_symbol ?? "APT";

  // Networks with a faucet API (Movement testnet, local) fund the connected account directly
  const fundFromFaucet = async () => {
    setIsFunding(true);
    try {
      // Waits for the transaction, not for an indexer (the local node runs none by default)
      await aptos.fundAccount({ accountAddress: address, amount: FAUCET_AMOUNT, options: { waitForIndexer: false } });
      await queryClient.invalidateQueries({ queryKey: ["accountNativeBalance"] });
      notification.success(`Received 1 ${symbol} from the faucet`);
    } catch (error) {
      notification.error(`Faucet failed: ${error instanceof Error ? error.message : error}`);
    } finally {
      setIsFunding(false);
    }
  };

  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  const { disconnect, wallet } = useWallet();

  const switchingDisabled = isNetworkSwitchingDisabled(wallet?.name);

  return (
    <>
      <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        <summary className="btn btn-secondary btn-sm pl-0 pr-2 dropdown-toggle gap-0 h-auto!">
          <BlockieAvatar address={address} size={30} />
          <span className="ml-2 mr-1">{address?.slice(0, 6) + "..." + address?.slice(-4)}</span>
          <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
        </summary>
        <ul tabIndex={0} className="dropdown-content menu z-2 p-2 mt-2 shadow-lg bg-base-200 gap-1">
          <NetworkOptions hidden={!selectingNetwork} />
          <li className={selectingNetwork ? "hidden" : ""}>
            <div className="btn-sm flex gap-3 py-3 cursor-pointer" onClick={() => copyToClipboard(address)}>
              {isCopiedToClipboard ? (
                <CheckCircleIcon className="text-xl font-normal h-6 w-4 ml-2 sm:ml-0" aria-hidden="true" />
              ) : (
                <DocumentDuplicateIcon className="text-xl font-normal h-6 w-4 ml-2 sm:ml-0" aria-hidden="true" />
              )}
              <span className="whitespace-nowrap">Copy address</span>
            </div>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <label htmlFor="qrcode-modal" className="btn-sm flex gap-3 py-3">
              <QrCodeIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span className="whitespace-nowrap">View QR Code</span>
            </label>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <button className="menu-item btn-sm flex gap-3 py-3" type="button">
              <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <a
                target="_blank"
                href={blockExplorerAddressLink}
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
                View on Block Explorer
              </a>
            </button>
          </li>
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className={`btn-sm flex gap-3 py-3 ${switchingDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                type="button"
                onClick={() => {
                  if (!switchingDisabled) {
                    setSelectingNetwork(true);
                  }
                }}
                disabled={switchingDisabled}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Switch Network</span>
              </button>
            </li>
          ) : null}
          {targetNetwork.faucet_api ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button className="btn-sm flex gap-3 py-3" type="button" disabled={isFunding} onClick={fundFromFaucet}>
                {isFunding ? (
                  <span className="loading loading-spinner loading-xs ml-2 sm:ml-0" />
                ) : (
                  <BanknotesIcon className="h-6 w-4 ml-2 sm:ml-0" />
                )}
                <span className="whitespace-nowrap">Faucet</span>
              </button>
            </li>
          ) : (
            targetNetwork.faucet_url && (
              // e.g. Aptos testnet: its faucet only works through the website
              <li className={selectingNetwork ? "hidden" : ""}>
                <a
                  className="btn-sm flex gap-3 py-3"
                  target="_blank"
                  href={targetNetwork.faucet_url}
                  rel="noopener noreferrer"
                >
                  <BanknotesIcon className="h-6 w-4 ml-2 sm:ml-0" />
                  <span className="whitespace-nowrap">Faucet</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 -ml-1" aria-hidden="true" />
                </a>
              </li>
            )
          )}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button className="menu-item text-error btn-sm flex gap-3 py-3" type="button" onClick={() => disconnect()}>
              <ArrowLeftEndOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </details>
    </>
  );
};

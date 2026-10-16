import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AdapterNotDetectedWallet,
  AdapterWallet,
  WalletItem,
  WalletSortingOptions,
  groupAndSortWallets,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

interface WalletSelectorProps extends WalletSortingOptions {
  isModalOpen?: boolean;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
}

export function WalletSelector({ isModalOpen, setModalOpen, ...walletSortingOptions }: WalletSelectorProps) {
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);

  useEffect(() => {
    // If the component is being used as a controlled component,
    // sync the external and internal modal state.
    if (isModalOpen !== undefined) {
      setWalletSelectorModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const { account, connected, disconnect, wallets = [], notDetectedWallets = [] } = useWallet();

  // `wallets` only holds detected wallets, so add the not-detected ones to get install links under "More Wallets".
  // The social-login (Petra Web) wallets it also returns aren't shown: the app doesn't offer social login.
  const { availableWallets, installableWallets } = groupAndSortWallets(
    [...wallets, ...notDetectedWallets],
    walletSortingOptions,
  );

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect();
    } else {
      setWalletSelectorModalOpen(true);
    }
  };

  const closeModal = () => {
    setWalletSelectorModalOpen(false);
    if (setModalOpen) {
      setModalOpen(false);
    }
  };

  const buttonText = account?.ansName || truncateAddress(account?.address?.toString()) || "Unknown";

  return (
    <>
      <button className="btn btn-primary mr-1" onClick={onWalletButtonClick}>
        {connected ? buttonText : "Connect Wallet"}
      </button>

      {walletSelectorModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm border-2 border-base-300 shadow-xl">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg wallet-modal-title">Connect Wallet</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                ✕
              </button>
            </div>

            {/* Modal content */}
            {!connected && (
              <>
                <div className="flex flex-col gap-3">
                  {availableWallets.map(wallet => (
                    <WalletRow key={wallet.name} wallet={wallet} onConnect={closeModal} />
                  ))}
                </div>

                {!!installableWallets.length && (
                  <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title">More Wallets</div>
                    <div className="collapse-content">
                      <div className="flex flex-col gap-3">
                        {installableWallets.map(wallet => (
                          <WalletRow key={wallet.name} wallet={wallet} onConnect={closeModal} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}

interface WalletRowProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <div className="flex items-center justify-between p-2 hover:bg-base-200 wallet-menu-wrapper">
        <div className="flex items-center gap-2 wallet-name-wrapper">
          <WalletItem.Icon className="wallet-selector-icon" />
          <WalletItem.Name asChild>
            <span className="wallet-selector-text">{wallet.name}</span>
          </WalletItem.Name>
        </div>
        {isInstallRequired(wallet) ? (
          <WalletItem.InstallLink className="btn btn-sm btn-outline btn-secondary mr-1" />
        ) : (
          <WalletItem.ConnectButton asChild>
            <button className="btn btn-sm btn-secondary">Connect</button>
          </WalletItem.ConnectButton>
        )}
      </div>
    </WalletItem>
  );
}

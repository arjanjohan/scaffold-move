import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AnyAptosWallet,
  AptosPrivacyPolicy,
  WalletItem,
  WalletSortingOptions,
  groupAndSortWallets,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import scaffoldConfig from "~~/scaffold.config";

interface WalletSelectorProps extends WalletSortingOptions {
  isModalOpen?: boolean;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
}

const allowAptosConnect = scaffoldConfig.allowAptosConnect;

export function WalletSelector({ isModalOpen, setModalOpen, ...walletSortingOptions }: WalletSelectorProps) {
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);

  useEffect(() => {
    // If the component is being used as a controlled component,
    // sync the external and internal modal state.
    if (isModalOpen !== undefined) {
      setWalletSelectorModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const { account, connected, disconnect, wallets = [] } = useWallet();

  const { aptosConnectWallets, availableWallets, installableWallets } = groupAndSortWallets(
    wallets,
    walletSortingOptions,
  );

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

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

  const buttonText = account?.ansName || truncateAddress(account?.address) || "Unknown";

  const renderEducationScreens = (screen: AboutAptosConnectEducationScreen) => (
    <dialog open className="modal modal-open">
      <div className="modal-box border-2 border-base-300 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button className="btn btn-sm btn-circle" onClick={screen.cancel}>
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h3 className="font-bold text-lg">About Aptos Connect</h3>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-sm">
            <screen.Graphic />
          </div>
          <div className="text-center">
            <screen.Title className="text-xl font-bold mb-2" />
            <screen.Description className="text-base-content/80" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <button className="btn btn-ghost" onClick={screen.back}>
            Back
          </button>

          <div className="flex gap-2">
            {screen.screenIndicators.map((ScreenIndicator, i) => (
              <ScreenIndicator key={i} className="w-2 h-2">
                <div />
              </ScreenIndicator>
            ))}
          </div>

          <button className="btn btn-ghost gap-2" onClick={screen.next}>
            {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={screen.cancel}>close</button>
      </form>
    </dialog>
  );

  return (
    <>
      <button className="btn btn-primary wallet-button" onClick={onWalletButtonClick}>
        {connected ? buttonText : "Connect Wallet"}
      </button>

      <AboutAptosConnect renderEducationScreen={renderEducationScreens}>
        {walletSelectorModalOpen && (
          <dialog open className="modal modal-open">
            <div className="modal-box max-w-sm border-2 border-base-300 shadow-xl">
              {/* Modal header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg wallet-modal-title">
                  {hasAptosConnectWallets && allowAptosConnect ? (
                    <div className="flex flex-col">
                      <span>Log in or sign up</span>
                      <span>with Social + Aptos Connect</span>
                    </div>
                  ) : (
                    "Connect Wallet"
                  )}
                </h3>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                  ✕
                </button>
              </div>

              {/* Modal content */}
              {!connected && (
                <>
                  {hasAptosConnectWallets && allowAptosConnect && (
                    <div className="flex flex-col gap-3">
                      {aptosConnectWallets.map(wallet => (
                        <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={closeModal} />
                      ))}

                      <AptosPrivacyPolicy className="aptos-connect-privacy-policy-wrapper">
                        <p className="aptos-connect-privacy-policy-text">
                          <AptosPrivacyPolicy.Disclaimer />{" "}
                          <AptosPrivacyPolicy.Link className="aptos-connect-privacy-policy-link" />
                          <span>.</span>
                        </p>
                        <AptosPrivacyPolicy.PoweredBy className="aptos-connect-powered-by" />
                      </AptosPrivacyPolicy>

                      <div className="divider">Or</div>
                    </div>
                  )}

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
      </AboutAptosConnect>
    </>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 wallet-menu-wrapper">
        <div className="flex items-center gap-2 wallet-name-wrapper">
          <WalletItem.Icon className="wallet-selector-icon" />
          <WalletItem.Name asChild>
            <span className="wallet-selector-text">{wallet.name}</span>
          </WalletItem.Name>
        </div>
        {isInstallRequired(wallet) ? (
          <WalletItem.InstallLink className="btn btn-sm btn-outline wallet-connect-install" />
        ) : (
          <WalletItem.ConnectButton asChild>
            <button className="btn btn-sm wallet-connect-button">Connect</button>
          </WalletItem.ConnectButton>
        )}
      </div>
    </WalletItem>
  );
}

// Update AptosConnectWalletRow component
function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <WalletItem.ConnectButton asChild>
        <button className="btn btn-lg w-full aptos-connect-button">
          <WalletItem.Icon className="wallet-selector-icon" />
          <WalletItem.Name />
        </button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosClient } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";

export const useGetAccountNativeBalance = (address?: string) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const { account } = useWallet();

  useEffect(() => {
    const accountAddress = address || account?.address;
    if (!accountAddress) return;

    const fetchBalance = async () => {
      setLoading(true);
      setError(false);

      try {
        const result = await aptosClient.getAccountAPTAmount({ accountAddress });

        setBalance(result);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, account, aptosClient]);

  return { balance, loading, error, nativeTokenSymbol: network.targetNetwork.native_token_symbol || "APT" };
};

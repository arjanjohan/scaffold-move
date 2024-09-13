import { useEffect, useState } from "react";
import { useAptosClient } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";

export const useGetNativeBalance = (address: string) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      setLoading(true);
      setError(false);

      try {
        const result = await aptosClient.getAccountAPTAmount({ accountAddress: address });
        setBalance(result);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, aptosClient]);

  return { balance, loading, error };
};

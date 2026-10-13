import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useAptosClient } from "~~/hooks/scaffold-move";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";

export const useGetAccountNativeBalance = (address?: string) => {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const { account } = useWallet();

  // If address is not provided, use the wallet address
  const accountAddress = address || account?.address?.toString() || "";

  // Shared per chain and address, so multiple Balance components reuse one request
  const { data, isPending, isError } = useQuery({
    queryKey: ["accountNativeBalance", { chainId: network.targetNetwork.id, address: accountAddress }],
    queryFn: () => aptosClient.getAccountAPTAmount({ accountAddress }),
    enabled: !!accountAddress,
    retry: false,
  });

  return {
    balance: data ?? null,
    loading: isPending,
    error: isError,
    nativeTokenSymbol: network.targetNetwork.native_token_symbol || "APT",
  };
};

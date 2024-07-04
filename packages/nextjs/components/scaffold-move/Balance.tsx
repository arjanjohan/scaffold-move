"use client";

import { Address, formatEther } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import {useGetAccountAPTBalance} from "~~/hooks/scaffold-move/useGetAccountAPTBalance";
import {getFormattedBalanceStr} from "../../utils/scaffold-move/ContentValue/CurrencyValue"

type BalanceProps = {
  address: string;
};

/**
 * Display APT balance of an APT address.
 */
export const Balance = ({ address }: BalanceProps) => {
  const balance = useGetAccountAPTBalance(address);

  if (!address || balance === null) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  // if (isError) {
  //   return (
  //     <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
  //       <div className="text-warning">Error</div>
  //     </div>
  //   );
  // }
  // const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;

  return (
    <div className="w-full flex items-center justify-center">
      <>
        <span>{getFormattedBalanceStr(balance)}</span>
        <span className="text-[0.8em] font-bold ml-1">MOVE</span>
      </>
    </div>
  );
};

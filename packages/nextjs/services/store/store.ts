import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { Chain } from "~~/utils/scaffold-move/chains";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  targetNetwork: Chain;
  setTargetNetwork: (newTargetNetwork: Chain) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: Chain) => set(() => ({ targetNetwork: newTargetNetwork })),
}));

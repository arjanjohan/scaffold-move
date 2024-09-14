"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ModuleUI } from "~~/app/debug/_components/module";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { ModuleName } from "~~/utils/scaffold-move/module";
import { getAllModules } from "~~/utils/scaffold-move/modulesData";

export function DebugModules() {
  const { targetNetwork } = useTargetNetwork();

  // Fetch the module data based on the target network
  const modulesData = getAllModules(targetNetwork.id);
  const moduleNames = Object.keys(modulesData) as ModuleName[];

  const selectedModuleStorageKey = "scaffoldMove.selectedModule";

  const [selectedModule, setSelectedModule] = useLocalStorage<ModuleName>(selectedModuleStorageKey, moduleNames[0], {
    initializeWithValue: false,
  });

  useEffect(() => {
    if (!moduleNames.includes(selectedModule)) {
      setSelectedModule(moduleNames[0]);
    }
  }, [selectedModule, setSelectedModule, moduleNames]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {moduleNames.length === 0 ? (
        <p className="text-3xl mt-14">No modules found!</p>
      ) : (
        <>
          {moduleNames.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {moduleNames.map(moduleName => (
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    moduleName === selectedModule
                      ? "bg-base-300 hover:bg-base-300 no-animation"
                      : "bg-base-100 hover:bg-secondary"
                  }`}
                  key={moduleName as string}
                  onClick={() => setSelectedModule(moduleName)}
                >
                  {moduleName as string}
                  {modulesData[moduleName as string].external && (
                    <span className="tooltip tooltip-top tooltip-accent" data-tip="External module">
                      <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {moduleNames.map(moduleName => (
            <ModuleUI
              key={moduleName as string}
              moduleName={moduleName}
              className={moduleName === selectedModule ? "" : "hidden"}
            />
          ))}
        </>
      )}
    </div>
  );
}

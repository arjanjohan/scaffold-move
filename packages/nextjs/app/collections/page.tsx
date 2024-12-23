"use client";

import { Collection } from "./components/collection";
import type { NextPage } from "next";
import { useView } from "~~/hooks/scaffold-move/useView";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

const CollectionsPage: NextPage = () => {
  const { data: registry, isLoading: isLoadingRegistry } = useView({
    moduleName: MODULE_NAME,
    functionName: "get_registry",
  });

  console.log("AVH registry", registry);

  // TODO: Add a loading state
  // TODO: Add state for empty registry
  // TODO: Make items same size
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {registry?.[0] &&
          registry?.[0].map((item: any, index: any) => (
            <div key={index} className="flex justify-center">
              <Collection collectionAddress={item.inner} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CollectionsPage;

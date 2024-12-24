"use client";

import { useState } from "react";
import { NftItem } from "./components/nft-item";
import type { NextPage } from "next";
import { useGetOwnedNfts } from "~~/hooks/nft-minting/useGetOwnedNfts";
import { useView } from "~~/hooks/scaffold-move/useView";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

const MyNfts: NextPage = () => {
  const { data } = useGetOwnedNfts();
  const [selectedCollections, setSelectedCollections] = useState<string[]>(["all"]);

  const { data: registry } = useView({
    moduleName: MODULE_NAME,
    functionName: "get_registry",
  });

  const registeredCollections = registry?.[0]?.map((collection: any) => collection.inner) || [];

  const handleCollectionChange = (value: string) => {
    if (value === "all") {
      setSelectedCollections(["all"]);
    } else {
      const newSelected = selectedCollections.includes("all")
        ? [value]
        : selectedCollections.includes(value)
          ? selectedCollections.filter(c => c !== value)
          : [...selectedCollections, value];

      setSelectedCollections(newSelected.length ? newSelected : ["all"]);
    }
  };

  const filteredNfts = data?.filter(nft => {
    const isInRegistry = registeredCollections.includes(nft.current_token_data.collection_id);
    if (!isInRegistry) return false;

    return selectedCollections.includes("all") || selectedCollections.includes(nft.current_token_data.collection_id);
  });

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-6">
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn m-1 bg-base-100">
            {selectedCollections.includes("all")
              ? "All Collections"
              : `Selected Collections (${selectedCollections.length})`}
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a
                className={`${selectedCollections.includes("all") ? "active" : ""} text-xs`}
                onClick={() => handleCollectionChange("all")}
              >
                All Collections
                {selectedCollections.includes("all") && " ✓"}
              </a>
            </li>
            {registeredCollections.map((collectionId: string) => (
              <li key={collectionId}>
                <a
                  className={`${selectedCollections.includes(collectionId) ? "active" : ""} text-xs`}
                  onClick={() => handleCollectionChange(collectionId)}
                >
                  {collectionId.length > 23 ? collectionId.slice(0, 20) + "..." : collectionId}
                  {selectedCollections.includes(collectionId) && " ✓"}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredNfts?.map((nft: any) => (
          <div key={`${nft.token_data_id}_${nft.current_token_data.collection_id}`}>
            <NftItem tokenAddress={nft.token_data_id} collectionAddress={nft.current_token_data.collection_id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNfts;

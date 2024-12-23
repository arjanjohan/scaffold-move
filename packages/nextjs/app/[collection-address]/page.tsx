"use client";

import { useParams } from "next/navigation";
import MintNext from "./components/mint-next";
import MintStats from "./components/mint-stats";
import type { NextPage } from "next";
import NftImage from "~~/components/nft-minting/nft-image";
import { useGetCollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";

const CollectionDetailsPage: NextPage = () => {
  const params = useParams();
  const collectionAddress =
    typeof params["collection-address"] === "string" ? params["collection-address"] : params["collection-address"][0];
  const { data: collectionDetails } = useGetCollectionDetails(collectionAddress);

  return (
    <div className="container mx-auto p-8">
      {/* Collection name */}
      <h1 className="text-2xl font-bold mb-4">{collectionDetails?.collection_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column - 1/3 width */}
        <div className="space-y-6 md:col-span-2">
          <NftImage imgUri={collectionDetails?.cdn_asset_uris?.cdn_image_uri ?? "/placeholder.png"} />
        </div>

        {/* Right Column - 2/3 width */}
        <div className="space-y-6 md:col-span-3">
          <div className="p-6 bg-base-100 rounded-xl">
            <p>{collectionDetails?.description ?? ""}</p>
          </div>
          <MintNext collectionDetails={collectionDetails} />
          <MintStats collectionDetails={collectionDetails} />
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsPage;

"use client";

import { CollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";

interface MintStatsProps {
  collectionDetails: CollectionDetails;
}

const MintStats = ({ collectionDetails }: MintStatsProps) => {
  return (
    <div>
      {/* Mint Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center bg-base-100 p-4 rounded-xl">
          <p className="font-bold">Minted</p>
          <p>{collectionDetails?.current_supply}</p>
        </div>
        <div className="text-center bg-base-100 p-4 rounded-xl">
          <p className="font-bold">Max Supply</p>
          <p>{collectionDetails?.max_supply}</p>
        </div>
        <div className="text-center bg-base-100 p-4 rounded-xl">
          <p className="font-bold">Unique Holders</p>
          <p>{collectionDetails?.unique_holders}</p>
        </div>
      </div>
    </div>
  );
};

export default MintStats;

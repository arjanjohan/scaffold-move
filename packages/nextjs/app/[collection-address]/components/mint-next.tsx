"use client";

import { useState } from "react";
import { Address } from "~~/components/scaffold-move";
import { CollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

interface MintNextProps {
  collectionDetails: CollectionDetails;
}

const MintNext = ({ collectionDetails }: MintNextProps) => {
  const collectionAddress = collectionDetails.collection_address;
  const availableMints = collectionDetails?.max_supply - collectionDetails?.current_supply;

  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction(MODULE_NAME);
  const [mintAmount, setMintAmount] = useState(1);

  return (
    <div>
      <div className="p-6 bg-base-100 rounded-xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-y-2">
            <input
              type="number"
              className="input input-bordered w-full bg-base-200"
              min="1"
              max={availableMints}
              defaultValue="1"
              onChange={e => setMintAmount(parseInt(e.target.value))}
            />
            <button
              className="btn btn-primary w-full"
              onClick={() => submitTransaction("mint_nft", [collectionAddress, mintAmount])}
            >
              Mint
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {collectionDetails?.current_supply ?? 0} / {collectionDetails?.max_supply ?? 0} Minted
              </span>
            </div>
            <div className="flex items-center gap-2"></div>
          </div>
          <div className="flex gap-x-2 items-center flex-wrap justify-between">
            <p className="whitespace-nowrap body-sm-semibold">Collection Address</p>

            <Address address={collectionAddress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNext;

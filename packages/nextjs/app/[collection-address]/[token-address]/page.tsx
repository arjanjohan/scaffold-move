"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import NftImage from "~~/components/nft-minting/nft-image";
import { Address } from "~~/components/scaffold-move/Address";
import { useGetCollectionItemDetails } from "~~/hooks/nft-minting/useGetCollectionItemDetails";
import { getIpfsUrl } from "~~/utils/nft-minting/ipfsUploader";

const MyNftsPage: NextPage = () => {
  const params = useParams();
  const itemAddress =
    typeof params["token-address"] === "string" ? params["token-address"] : params["token-address"][1];
  const { data: itemDetails } = useGetCollectionItemDetails(itemAddress);

  const [imgUrl, setImgUrl] = useState<string>("/placeholder.png");

  useEffect(() => {
    if (itemDetails.token_image) {
      const ipfsImgUrl = getIpfsUrl(itemDetails.token_image);
      if (ipfsImgUrl) {
        setImgUrl(ipfsImgUrl);
      }
    }
  }, [itemDetails.token_image]); // const attributes = ipfs_metadata?.attributes;

  return (
    <div className="container mx-auto p-8">
      {/* Collection name */}
      {/* <h1 className="text-2xl font-bold mb-4">{collectionItemDetails?.collection_name} #{itemId}</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column - 1/3 width */}
        <div className="space-y-6 md:col-span-2">
          <NftImage imgUri={imgUrl ?? "/placeholder.png"} />
        </div>

        {/* Right Column - 2/3 width */}
        <div className="space-y-6 md:col-span-3">
          <div className="p-6 bg-base-100 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{itemDetails.token_name} </h2>
            <div className="mb-4">
              <p>{itemDetails.token_description}</p>
              <Address address={itemDetails.collection_address} size="xs" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Attributes</h2>
            <div className="grid grid-cols-3 gap-4">
              {itemDetails.attributes.map((attribute: any) => (
                <div key={attribute.trait_type} className="p-3 bg-base-200 rounded-lg">
                  <p className="text-xs text-base-content/70 uppercase">{attribute.trait_type}</p>
                  <p className="text-base font-semibold">{attribute.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyNftsPage;

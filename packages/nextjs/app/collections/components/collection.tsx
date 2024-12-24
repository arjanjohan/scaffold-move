import Link from "next/link";
import NftImage from "~~/components/nft-minting/nft-image";
import { useGetCollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";
import { useGetIpfsMetadata } from "~~/hooks/nft-minting/useGetIpfsMetadata";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { CollectionMetadata, getIpfsHash, getIpfsUrl } from "~~/utils/nft-minting/ipfsUploader";

interface CollectionProps {
  collectionAddress: string;
}

export const Collection = ({ collectionAddress }: CollectionProps) => {
  const { targetNetwork } = useTargetNetwork();
  const { data: collectionDetails } = useGetCollectionDetails(collectionAddress);
  const ipfs_metadata = useGetIpfsMetadata<CollectionMetadata>(
    collectionDetails?.uri ? getIpfsHash(collectionDetails.uri) : "",
  ).data;

  if (!collectionDetails || !ipfs_metadata) {
    return null;
  }

  const mintProgress = (collectionDetails.current_supply / collectionDetails.max_supply) * 100;
  const imgUrl = getIpfsUrl(ipfs_metadata.image);

  return (
    <Link href={`/${collectionAddress}`}>
      <div className="w-[280px] h-[420px] p-6 bg-base-100 rounded-xl shadow-xl hover:shadow-2xl transition-shadow cursor-pointer flex flex-col">
        <h2 className="text-lg font-bold truncate leading-tight">{ipfs_metadata.name}</h2>
        <div className="w-full aspect-square">
          <NftImage imgUri={imgUrl ?? "/placeholder.png"} />
        </div>
        <p className="text-sm text-base-content/70 line-clamp-2 mb-3">{ipfs_metadata.description}</p>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Minted:
              <br />
              {collectionDetails.current_supply ?? 0} / {collectionDetails.max_supply ?? 0}
            </span>
            <span>
              Mint Fee:
              <br />
              {collectionDetails.mint_fee ?? 0} {targetNetwork.native_token_symbol || "APT"}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="w-full bg-base-300 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${mintProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

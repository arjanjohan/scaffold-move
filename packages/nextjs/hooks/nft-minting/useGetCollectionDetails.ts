import { useView } from "../scaffold-move/useView";
import { useGetCollectionData } from "~~/hooks/nft-minting/useGetCollectionData";
import { useGetAccountResource } from "~~/hooks/scaffold-move/useGetAccountResource";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

export interface CollectionDetails {
  collection_resource_loaded: boolean;
  collection_data_loaded: boolean;
  unique_item_count: number;
  mint_fee: number;
  mint_enabled: boolean;
  creator_address: string;
  collection_address: string;
  collection_name: string;
  current_supply: number;
  max_supply: number;
  unique_holders: number;
  uri: string;
  description: string;
  cdn_asset_uris: {
    cdn_animation_uri: string;
    cdn_image_uri: string;
  };
}

export function useGetCollectionDetails(collection_address: string) {
  const { data: collectionResource } = useGetAccountResource("collection", "Collection", "0x4", collection_address);
  const { data: collectionData } = useGetCollectionData(collection_address);
  const { data: uniqueItemCount, isLoading: isLoadingUniqueItemCount } = useView({
    moduleName: MODULE_NAME,
    functionName: "get_unique_item_count",
    args: [collection_address],
  });

  const { data: isMintEnabled, isLoading: isLoadingIsMintEnabled } = useView({
    moduleName: MODULE_NAME,
    functionName: "is_mint_enabled",
    args: [collection_address],
  });

  const { data: mintPrice, isLoading: isLoadingMintPrice } = useView({
    moduleName: MODULE_NAME,
    functionName: "get_mint_fee",
    args: [collection_address, 1],
  });

  let data: CollectionDetails = {
    collection_resource_loaded: collectionResource ? true : false,
    collection_data_loaded: collectionData ? true : false,
    unique_item_count: Number(uniqueItemCount?.[0] ?? 0),
    mint_fee: Number(mintPrice?.[0] ?? 0),
    mint_enabled: isMintEnabled?.[0] ?? false,
    creator_address: collectionResource?.creator,
    collection_address: collection_address,
    collection_name: collectionResource?.name,
    current_supply: collectionData?.totalMinted ?? 0,
    max_supply: collectionData?.maxSupply ?? 0,
    unique_holders: collectionData?.uniqueHolders ?? 0,
    uri: collectionResource?.uri,
    description: collectionResource?.description,
    cdn_asset_uris: collectionData?.collection?.cdn_asset_uris ?? { cdn_animation_uri: "", cdn_image_uri: "" },
  };

  return { data };
}

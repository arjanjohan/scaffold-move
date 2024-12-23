// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import type { NextPage } from "next";
// import { useGetCollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";
// import { useGetIpfsMetadata } from "~~/hooks/nft-minting/useGetIpfsMetadata";
// import { convertIpfsUriToCid, convertIpfsUriToItemCid } from "~~/utils/nft-minting/ipfsUploader";

// const CollectionDetails: NextPage = () => {
//   const params = useParams();
//   const collectionAddress = typeof params.id === "string" ? params.id : params.id[0];
//   const [selectedNft, setSelectedNft] = useState(1);
//   const [selectedNftImage, setSelectedNftImage] = useState("/placeholder.png");

//   const { data: collectionDetails } = useGetCollectionDetails(collectionAddress);

//   const [itemIpfsUri, setItemIpfsUri] = useState("");

//   const [imageUrl, setImageUrl] = useState("/placeholder.png");
//   const [collectionItemMetadata, setCollectionItemMetadata] = useState<any>(null);
//   const { data: metadata, refetch: refetchMetadata } = useGetIpfsMetadata(itemIpfsUri);

//   useEffect(() => {
//     if (collectionDetails?.uri) {
//       setItemIpfsUri(convertIpfsUriToItemCid(collectionDetails?.uri, selectedNft));

//       refetchMetadata(itemIpfsUri);
//       if (metadata?.image) {
//         const nftImage = convertIpfsUriToCid(metadata.image);
//         setSelectedNftImage(nftImage);
//       }
//     }
//     // if (metadata?.image) {
//     //   setImageUrl(convertIpfsUriToItemCid(metadata.image, selectedNft));
//     // }
//   }, [selectedNft]);

//   return (
//     <div className="container mx-auto p-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column */}
//         <div className="space-y-6">
//           {/* Collection Logo */}
//           <div className="w-full aspect-square relative rounded-xl overflow-hidden">
//             <Image
//               src={collectionDetails?.cdn_asset_uris?.cdn_image_uri ?? "/placeholder.png"}
//               alt="Collection Logo"
//               fill
//               className="object-cover"
//             />
//           </div>

//           {/* Mint Stats */}
//           <div className="card bg-base-200 p-6">
//             <h2 className="text-2xl font-bold mb-4">Collection Stats</h2>
//             <div className="space-y-2">
//               <p>Minted: {collectionDetails?.current_supply}</p>
//               <p>Mint Price: {collectionDetails?.mint_fee} APT</p>
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           {/* Mint Component */}
//           <div className="card bg-base-200 p-6">
//             <h2 className="text-2xl font-bold mb-4">Mint NFT</h2>
//             <div className="space-y-4">
//               {/* Preview of selected NFT */}
//               <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4">
//                 <Image src={selectedNftImage} alt={`NFT #${selectedNft}`} fill className="object-cover" />
//               </div>
//               <select
//                 className="select select-bordered w-full"
//                 onChange={e => setSelectedNft(Number(e.target.value))}
//                 value={selectedNft}
//               >
//                 {[...Array(collectionDetails?.unique_item_count ?? 1)].map((_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     NFT #{i + 1}
//                   </option>
//                 ))}
//               </select>
//               <button className="btn btn-primary w-full">Mint NFT</button>
//             </div>
//           </div>

//           {/* Items Component */}
//           {/* <div className="card bg-base-200 p-6">
//             <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
//             <div className="grid grid-cols-2 gap-4">
//               {[1, 2, 3, 4].map((item) => (
//                 <div key={item} className="card bg-base-100">
//                   <div className="aspect-square relative">
//                     <Image
//                       src={collectionDetails?.cdn_asset_uris?.cdn_image_uri ?? "/placeholder.png"}
//                       alt={`NFT ${item}`}
//                       fill
//                       className="object-cover rounded-t-xl"
//                     />
//                   </div>
//                   <div className="p-3">
//                     <p className="font-semibold">NFT #{item}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollectionDetails;

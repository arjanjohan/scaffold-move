// "use client";

// import { useRef, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import type { NextPage } from "next";
// import { Input } from "~~/components/Input";
// import { Address, InputBase } from "~~/components/scaffold-move";
// import { useGetModule } from "~~/hooks/scaffold-move/useGetModule";
// import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";

// const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

// // Alert Component for showing error messages or warnings
// const Alert = ({ message }: { message: string }) => (
//   <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
//     <p className="text-3xl mt-14">{message}</p>
//   </div>
// );

// const Create: NextPage = () => {
//   const { account } = useWallet();
//   const router = useRouter();

//   const [mintStartDate, setMintStartDate] = useState<string>("");
//   const [mintEndDate, setMintEndDate] = useState<string>("");

//   const [maxSupply, setMaxSupply] = useState<number>(100);

//   const [royaltyPercentage, setRoyaltyPercentage] = useState<number>();
//   // const [preMintAmount, setPreMintAmount] = useState<number>();
//   // const [publicMintLimitPerAccount, setPublicMintLimitPerAccount] = useState<number>(1);
//   const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();
//   const [files, setFiles] = useState<FileList | null>(null);

//   // Local Ref
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Internal state
//   const [isUploading, setIsUploading] = useState(false);

//   const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction(MODULE_NAME);

//   const moveModule = useGetModule(MODULE_NAME);
//   const abi = moveModule?.abi;

//   // On create collection button clicked
//   const createCollection = async () => {
//     try {
//       if (!account) throw new Error("Please connect your wallet");
//       if (!files) throw new Error("Please upload files");
//       // if (account.address !== CREATOR_ADDRESS) throw new Error("Wrong account");
//       if (isUploading) throw new Error("Uploading in progress");

//       // Set internal isUploading state
//       setIsUploading(true);

//       const { uploadCollectionData } = await import("~~/utils/ipfsUploader");

//       // Upload collection files to Irys
//       const { collectionName, collectionDescription, projectUri } = await uploadCollectionData(files);
//       try {
//         await submitTransaction("create_collection", [
//           collectionDescription,
//           collectionName,
//           projectUri,
//           maxSupply,
//           royaltyPercentage ? royaltyPercentage : 0,
//           undefined, // ignore pre mint amount
//           undefined, // ignore allowlist fields
//           undefined, // ignore allowlist fields
//           undefined, // ignore allowlist fields
//           undefined, // ignore allowlist fields
//           undefined, // ignore allowlist fields
//           mintStartDate ? Math.floor(new Date(mintStartDate).getTime() / 1000) : undefined,
//           mintEndDate ? Math.floor(new Date(mintEndDate).getTime() / 1000) : undefined,
//           maxSupply, // ignore mint limit per account by using maxSupply
//           // AVH TODO: consider removing mint limit from contract
//           publicMintFeePerNFT ? publicMintFeePerNFT : 0,
//         ]);

//         if (transactionResponse?.transactionSubmitted) {
//           console.log("Transaction successful:", transactionResponse.success ? "success" : "failed");

//           // TODO: transactionresponse not always working
//           router.push("/collections");
//         }
//       } catch (error) {
//         console.error("Error submitting transaction:", error);
//       }
//     } catch (error) {
//       alert(error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="flex items-center flex-col flex-grow">
//       <div className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl p-6 mt-8 w-full max-w-lg">
//         <div className="text-xl">Create Collection</div>
//         <p className="text-sm mb-2">
//           This page is for artists to upload their NFT collection.
//           {/* For more details on the process, please
//           visit the{" "}
//           <Link className="underline" href="/TODO" target="_blank" rel="noopener noreferrer">
//             FAQ page
//           </Link>
//           . */}
//         </p>
//         <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
//           <p className="my-2 font-medium">Connected Address:</p>
//           <Address address={account?.address} />
//           {/* TODO: check if the address is whitelisted as an artist */}
//         </div>{" "}
//       </div>
//       <div className="flex flex-col items-center space-y-4 bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 p-6 mt-8 w-full max-w-lg">
//         <h2 className="text-lg font-semibold">Collection data</h2>
//         <p className="text-sm">Uploads collection files to IPFS</p>

//         <div className="flex flex-col items-start justify-between">
//           <Input
//             className="hidden"
//             ref={inputRef}
//             id="upload"
//             // disabled={isUploading || !account}
//             webkitdirectory="true"
//             multiple
//             type="file"
//             placeholder="Upload Assets"
//             onChange={event => {
//               setFiles(event.currentTarget.files);
//             }}
//           />

//           {!!files?.length && (
//             <div>
//               {files.length} files selected{" "}
//               <button
//                 className="text-error"
//                 onClick={() => {
//                   setFiles(null);
//                   inputRef.current!.value = "";
//                 }}
//               >
//                 Clear
//               </button>
//             </div>
//           )}
//         </div>
//         <div className="w-full flex flex-row gap-4">
//           <div className="w-1/2">
//             <div className="flex items-center ml-2 mb-2">
//               <span className="text-xs font-medium mr-2 leading-none">Public mint start date</span>
//             </div>
//             <input
//               type="datetime-local"
//               className="input input-bordered w-full"
//               value={mintStartDate}
//               onChange={e => setMintStartDate(e.target.value)}
//             />
//           </div>
//           <div className="w-1/2">
//             <div className="flex items-center ml-2 mb-2">
//               <span className="text-xs font-medium mr-2 leading-none">Public mint end date</span>
//             </div>
//             <input
//               type="datetime-local"
//               className="input input-bordered w-full"
//               value={mintEndDate}
//               onChange={e => setMintEndDate(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="w-full flex flex-col gap-4">
//           {/* <div className="w-full">
//             <div className="flex items-center ml-2 mb-2">
//               <span className="text-xs font-medium mr-2 leading-none">Premint amount</span>
//             </div>
//             <input
//               type="number"
//               min="1"
//               className="input input-bordered w-full"
//               value={preMintAmount}
//               onChange={(e) => setPreMintAmount(Math.max(0, parseInt(e.target.value) || 0))}
//             />
//           </div> */}
//           {/* <div className="w-full">
//             <div className="flex items-center ml-2 mb-2">
//               <span className="text-xs font-medium mr-2 leading-none">Mint limit per address</span>
//             </div>
//             <input
//               type="number"
//               min="1"
//               className="input input-bordered w-full"
//               value={publicMintLimitPerAccount}
//               onChange={(e) => setPublicMintLimitPerAccount(Math.max(1, parseInt(e.target.value) || 1))}
//             />
//           </div> */}
//           <div className="w-full">
//             <div className="flex items-center ml-2 mb-2">
//               <span className="text-xs font-medium mr-2 leading-none">Royalty fee (%)</span>
//             </div>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               className="input input-bordered w-full"
//               value={royaltyPercentage}
//               onChange={e => setRoyaltyPercentage(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
//               placeholder="Optional"
//             />
//           </div>
//           <div className="w-full">
//             <div className="flex items-center ml-2 mb-2">
//               <span className="text-xs font-medium mr-2 leading-none">Mint fee (APT)</span>
//             </div>
//             <input
//               type="number"
//               min="0"
//               step="0.1"
//               className="input input-bordered w-full"
//               value={publicMintFeePerNFT}
//               onChange={e => setPublicMintFeePerNFT(Math.max(0, parseFloat(e.target.value) || 0))}
//               placeholder="Optional"
//             />
//           </div>
//         </div>
//         <button className="btn btn-secondary mt-2" disabled={!account} onClick={createCollection}>
//           Create collection
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Create;

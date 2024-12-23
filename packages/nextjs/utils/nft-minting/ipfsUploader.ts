import { useQuery } from "@tanstack/react-query";
import { ImportCandidate } from "ipfs-core-types/dist/src/utils";
import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_PROJECT_SECRET;

if (!projectId || !projectSecret) {
  throw new Error("IPFS credentials not found in environment variables");
}
// Configure the IPFS client
export const ipfsClient = create({
  host: "ipfs.infura.io", // You can use Infura or your own IPFS node
  port: 5001,
  protocol: "https",
  headers: {
    authorization: "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64"),
  },
});

const VALID_MEDIA_EXTENSIONS = ["png", "jpg", "jpeg", "gltf"] as const;

export type CollectionMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
};

type ImageAttribute = {
  trait_type: string;
  value: string;
};

export type TokenMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: ImageAttribute[];
};

export const uploadCollectionData = async (
  fileList: FileList,
): Promise<{
  collectionName: string;
  collectionDescription: string;
  uniqueItemCount: number;
  projectUri: string;
}> => {
  const files: File[] = [];
  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }

  const collectionFiles = files.filter(file => file.name.includes("collection"));
  if (collectionFiles.length !== 2) {
    throw new Error("Please make sure you include both collection.json and collection image file");
  }

  const collectionMetadataFile = collectionFiles.find(file => file.name === "collection.json");
  if (!collectionMetadataFile) {
    throw new Error("Collection metadata not found, please make sure you include collection.json file");
  }

  const collectionCover = collectionFiles.find(file =>
    VALID_MEDIA_EXTENSIONS.some(ext => file.name.endsWith(`.${ext}`)),
  );
  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  const mediaExt = collectionCover.name.split(".").pop();
  // Sort and validate nftImageMetadatas to ensure filenames are sequential
  const nftImageMetadatas = files
    .filter(file => file.name.endsWith("json") && file.name !== "collection.json")
    .sort((a, b) => {
      const getFileNumber = (file: File) => parseInt(file.name.replace(".json", ""), 10);

      const numA = getFileNumber(a);
      const numB = getFileNumber(b);

      return numA - numB; // Sort by the numeric part of the filenames
    });
  if (nftImageMetadatas.length === 0) {
    throw new Error("Image metadata not found, please make sure you include the NFT json files");
  }
  // Validate that nftImageMetadatas filenames start from 1 and are sequential
  validateSequentialFilenames(nftImageMetadatas, "json");

  const imageFiles = files
    .filter(file => file.name.endsWith(`.${mediaExt}`) && file.name !== collectionCover.name)
    .sort((a, b) => {
      const getFileNumber = (file: File) => parseInt(file.name.replace(`.${mediaExt}`, ""), 10);

      const numA = getFileNumber(a);
      const numB = getFileNumber(b);

      return numA - numB; // Sort by the numeric part of the filenames
    });
  if (imageFiles.length === 0) {
    throw new Error("Image files not found, please make sure you include the NFT image files");
  }
  if (nftImageMetadatas.length !== imageFiles.length) {
    throw new Error("Mismatch between NFT metadata json files and images files");
  }
  // Validate that imageFiles filenames start from 1 and are sequential
  validateSequentialFilenames(imageFiles, mediaExt ?? "");

  // Upload images and metadata to IPFS
  // const ipfsUploads: { path: string; cid: string }[] = [];
  const uploadFileToIpfs = async (file: File, path?: string) => {
    const added = await ipfsClient.add(path ? { path, content: file } : file);
    return added.cid.toString();
  };

  const filesToUpload: ImportCandidate[] = [];

  const imageFolderCid = await uploadFileToIpfs(collectionCover);

  const updatedCollectionMetadata: CollectionMetadata = JSON.parse(await collectionMetadataFile.text());
  updatedCollectionMetadata.image = `ipfs://${imageFolderCid}`;

  // Step 1: Upload main image files and corresponding metadata files
  await Promise.all(
    nftImageMetadatas.map(async (metadataFile, index) => {
      const metadata: ImageMetadata = JSON.parse(await metadataFile.text());
      const imageFile = imageFiles[index];

      // Upload image file
      const imageCid = await uploadFileToIpfs(imageFile);
      metadata.image = `ipfs://${imageCid}`;

      // Create updated metadata file
      const updatedMetadataFile = new File([JSON.stringify(metadata)], `${index + 1}.json`, {
        type: metadataFile.type,
      });
      filesToUpload.push({ path: `${index + 1}.json`, content: updatedMetadataFile });
    }),
  );

  // Step 2: Add the collection.json file to the filesToUpload list
  const updatedCollectionFile = new File([JSON.stringify(updatedCollectionMetadata)], "collection.json", {
    type: collectionMetadataFile.type,
  });
  filesToUpload.push({ path: "collection.json", content: updatedCollectionFile });

  // Step 3: Upload all files in a single request to IPFS
  let folderCid = "";

  for await (const result of ipfsClient.addAll(filesToUpload, { wrapWithDirectory: true })) {
    folderCid = result.cid.toString(); // Store the final folder CID
  }

  return {
    projectUri: `ipfs://${folderCid}/collection.json`,
    uniqueItemCount: imageFiles.length,
    collectionName: updatedCollectionMetadata.name,
    collectionDescription: updatedCollectionMetadata.description,
  };
};

export const getIpfsHash = (ipfsUri: string) => {
  const ipfsHash = ipfsUri.replace("ipfs://", "");
  return ipfsHash;
};

export const getIpfsMetadata = async (ipfsHash: string) => {
  for await (const file of ipfsClient.get(ipfsHash)) {
    // The file is of type unit8array so we need to convert it to string
    const content = new TextDecoder().decode(file);
    // Remove any leading/trailing whitespace
    const trimmedContent = content.trim();
    // Find the start and end index of the JSON object
    const startIndex = trimmedContent.indexOf("{");
    const endIndex = trimmedContent.lastIndexOf("}") + 1;
    // Extract the JSON object string
    const jsonObjectString = trimmedContent.slice(startIndex, endIndex);
    try {
      const jsonObject = JSON.parse(jsonObjectString);
      return jsonObject;
    } catch (error) {
      console.log("Error parsing JSON:", error);
      return undefined;
    }
  }
};

export function convertIpfsUriToItemCid(ipfsUri: string, itemNumber: number) {
  return ipfsUri.replace("collection.json", `${itemNumber.toString()}.json`);
}

export function getIpfsUrl(ipfsUri: string) {
  return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");
}

const validateSequentialFilenames = (files: File[], extension: string, feature?: string) => {
  files.forEach((file, index) => {
    let filename = file.name.replace(`.${extension}`, "");
    if (feature) {
      filename = filename.replace(feature, "");
    }
    const fileNumber = parseInt(filename, 10);
    if (fileNumber !== index + 1) {
      throw new Error(
        `Filenames are not sequential. Expected ${feature ?? ""}${index + 1}.${extension} but found ${file.name}`,
      );
    }
  });
};
"use client";

import Image from "next/image";

interface MintNextProps {
  imgUri: string;
}

const NftImage = ({ imgUri }: MintNextProps) => {
  return (
    <div className="w-full aspect-square relative rounded-xl overflow-hidden">
      <Image src={imgUri} alt="Collection Logo" fill className="rounded-xl object-contain bg-base-300 p-4" />
    </div>
  );
};

export default NftImage;

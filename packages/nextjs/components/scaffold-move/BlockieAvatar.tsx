"use client";

import { blo } from "blo";

type BlockieAvatarProps = {
  address: string;
  size: number;
};

export const BlockieAvatar = ({ address, size }: BlockieAvatarProps) => (
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-full"
    src={blo(address as `0x${string}`)}
    width={size}
    height={size}
    alt={`${address} avatar`}
  />
);

"use client";

import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { ArrowRightIcon, DocumentDuplicateIcon, PlusCircleIcon, PhotoIcon, WalletIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const { account: connectedAccount } = useWallet();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
          <span className="block text-4xl font-bold">Scaffold Move NFT Template</span>
            <span className="block text-xl">Create and launch your NFT collection in minutes</span>
          </h1>
        </div>

        <div className="flex-grow w-full px-8 py-12">
          <div className="flex justify-center items-start gap-8 flex-col max-w-2xl mx-auto">
            <div className="flex items-center gap-6 w-full bg-base-100 p-6 rounded-xl">
              <DocumentDuplicateIcon className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-xl font-bold mb-2">1. Fork and Setup</h2>
                <p>
                  Start by forking the{" "}
                  <a href="https://github.com/arjanjohan/scaffold-move/tree/nft-minting" className="link link-primary" target="_blank" rel="noopener noreferrer">
                    repository
                  </a>{" "}
                  and following the setup instructions in the README.
                </p>
                <pre className="mt-2 p-2 bg-base-200 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  git clone --branch nft-minting --single-branch git@github.com:arjanjohan/scaffold-move.git
                </pre>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full bg-base-100 p-6 rounded-xl">
              <PlusCircleIcon className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-xl font-bold mb-2">2. Create Your Collection</h2>
                <p>
                  Head to the{" "}
                  <Link href="/create" className="link link-primary">
                    Create
                  </Link>{" "}
                  page to upload your NFT collection. You can use our{" "}
                  <a href="https://github.com/arjanjohan/scaffold-move/tree/nft-minting/example-collection" className="link link-primary" target="_blank" rel="noopener noreferrer">
                    example collection
                  </a>{" "}
                  or{" "}
                  <a href="https://raw.githubusercontent.com/arjanjohan/scaffold-move/nft-minting/example-collection.zip" className="link link-primary" target="_blank" rel="noopener noreferrer">
                    download the template as a zip file
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full bg-base-100 p-6 rounded-xl">
              <PhotoIcon className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-xl font-bold mb-2">3. View Your Collection</h2>
                <p>
                  Visit the{" "}
                  <Link href="/collections" className="link link-primary">
                    Collections
                  </Link>{" "}
                  page to see your uploaded collection. Click on it to view more details.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full bg-base-100 p-6 rounded-xl">
              <ArrowRightIcon className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-xl font-bold mb-2">4. Start Minting</h2>
                <p>
                  On your collection page, click the Mint button to mint your new NFTs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full bg-base-100 p-6 rounded-xl">
              <WalletIcon className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-xl font-bold mb-2">5. Manage Your NFTs</h2>
                <p>
                  Check out your minted NFTs on the{" "}
                  <Link href="/my-nfts" className="link link-primary">
                    My NFTs
                  </Link>{" "}
                  page. Use the collection filter to organize your view.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

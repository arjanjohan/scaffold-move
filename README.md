# 🏗 Scaffold Move

<div align="center">

![logo](/assets/logo_small.png)
<h4 align="center">
  <a href="https://scaffold-move-docs.vercel.app/">Documentation</a> |
  <a href="https://scaffold-move-chi.vercel.app/">Website</a>
</h4>
</div>

🧪 Scaffold Move is an open-source, cutting-edge toolkit for building decentralized applications (dApps) on Aptos or any other Move-based blockchain. It's designed to streamline the process of creating and deploying Move modules and building user interfaces that interact seamlessly with those modules.

 This NFT template uses a simplified Move Module based on the Aptos NFT launchpad from the [Aptos NFT minting dapp template](https://github.com/aptos-labs/create-aptos-dapp/tree/main/templates/nft-minting-dapp-template).

⚙️ Built using Move, Aptos TS SDK, Next.js, Tailwind CSS, and TypeScript.

- 🛫 **Deployment Scripts**: Simplify and automate your deployment workflow.
- ✅ **Module Hot Reload**: Your frontend automatically adapts to changes in your Move modules as you edit them.
- 🪝 **Custom Hooks**: A collection of React hooks to simplify interactions with Move modules.
- 🧱 **Components**: A library of common Web3 components to rapidly build your frontend.
- 🔐 **Wallet Integration**: Connect to any Aptos-compatible wallet and interact with the Aptos network directly from your frontend.

Perfect for hackathons, prototyping, or launching your next Move project!

![Debug Modules tab](assets/debug.png)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Aptos CLI](https://aptos.dev/en/build/cli)

## Quickstart

To get started with Scaffold Move, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/arjanjohan/scaffold-move.git
cd scaffold-move
yarn install
```

2. Then, initialize a new account.

```
yarn account
```

This command overwrites `packages/move/.aptos/config.yaml` with a new Aptos account. The new address is copied over to the first address in the Move.toml file. If no address exists in this file, it is added on a new line.

Use the `--network` tag to define a network to create the account on. Alternatively, you can change the `defaultNetwork` value in `packages/move/move.config.js`.

3. Depending on the network, make sure the correct address for the token-minter module is configured.
```
minter='0x3c41ff6b5845e0094e19888cba63773591be9de59cafa9e582386f6af15dd490' // aptos testnet
minter='0x768ba4825a2266cead251160e871faf90af491a4d4a3856f31e2cdcd9778b08c' // movement porto testnet
```

4. Deploy the test modules:

```
yarn deploy
```

This command deploys the move modules to the selected network. The modules are located in `packages/move/sources` and can be modified to suit your needs. The `yarn deploy` command uses `aptos move publish` to publish the modules to the network. After this is executes the script located in `scripts/loadModules.js` to make the new modules available in the nextjs frontend.

5. Configure the environment variables for the NextJS app.

Copy packages/nextjs/.env.example to packages/nextjs/.env and fill all values.
The Aptos API key can be requested from the [Aptos Build page](https://developers.aptoslabs.com/). The IPFS project ID and secret should be setup on [Infura](https://www.infura.io/). Finally make sure the module name matches your launchpad move module name, as this value is used throughout the app.

```
NEXT_PUBLIC_APTOS_API_KEY=

NEXT_PUBLIC_IPFS_PROJECT_ID=
NEXT_PUBLIC_IPFS_PROJECT_SECRET=

NEXT_PUBLIC_MODULE_NAME="launchpad"
```

6. On a second terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your Move modules using the `Debug Modules` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Create a collection by uploading the collection files. If you didn't create a collection yet, feel free to use or modify the [example-collection](example-collection) (also available as [a zip file](example-collection.zip)).
- After creating your collection, view it on the `/collections` page. Click on your a collection to mint your NFT!

## Future Development
This is a first version of the NFT Launchpad template. Your input is valuable - whether you find bugs, have suggestions, or want to contribute, we encourage you to get involved and help shape the future of Scaffold Move. Join our [developer Telegram channel](https://t.me/+lOn2MJawQlc1YjA8) to connect with the community, report issues, and stay updated on the latest developments.

## Links

- [Documentation](https://scaffold-move-docs.vercel.app/)
- [Scaffold Move Github](https://github.com/arjanjohan/scaffold-move)
- [Movement Developer Portal: NFT Learning Path](https://developer.movementnetwork.xyz/learning-paths/nft)
- [Aptos Docs: Digital Aseet](https://aptos.dev/en/build/smart-contracts/digital-asset)
- [Telegram Community](https://t.me/+lOn2MJawQlc1YjA8)

## Credits

None of this would have been possible without the great work done in:
- [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- [Aptos Explorer](https://github.com/aptos-labs/explorer)
- [Aptos Wallet Adapter](https://github.com/aptos-labs/aptos-wallet-adapter)

## Built by

- [arjanjohan](https://x.com/arjanjohan/)

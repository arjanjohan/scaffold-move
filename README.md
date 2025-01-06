# 🏗 Scaffold Move NFT Template

<div align="center">

![logo](/assets/logo_small.png)
<h4 align="center">
  <a href="https://scaffold-move-docs.vercel.app/">Documentation</a> |
  <a href="https://scaffold-move-chi.vercel.app/">Website</a>
</h4>
</div>

🧪 This NFT template is built with Scaffold Move and uses a simplified Move Module based on the Aptos NFT launchpad from the [Aptos NFT minting dapp template](https://github.com/aptos-labs/create-aptos-dapp/tree/main/templates/nft-minting-dapp-template).

⚙️ Built using Move, Aptos TS SDK, Next.js, Tailwind CSS, and TypeScript.

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
  
2. Initialize a new account.

```
yarn account
```

This command overwrites `packages/move/.aptos/config.yaml` with a new Aptos account. The new address is copied over to the first address in the Move.toml file. If no address exists in this file, it is added on a new line.

To deploy on another network, either change the default in `packages/move/move.config.ts`, or add the network vallue with the yarn command:
```
yarn account --network movement_testnet
```

3. Depending on the network, make sure the correct address for the [token-minter](https://github.com/aptos-labs/token-minter) module is configured. 
```
minter='0x3c41ff6b5845e0094e19888cba63773591be9de59cafa9e582386f6af15dd490' // aptos testnet
minter='0x768ba4825a2266cead251160e871faf90af491a4d4a3856f31e2cdcd9778b08c' // movement porto testnet
```

4. Deploy the launchpad module:

```
yarn deploy
```

This command deploys the move modules to the selected network. The modules are located in `packages/move/sources` and can be modified to suit your needs. The `yarn deploy` command uses `aptos move publish` to publish the modules to the network. After this is executes the script located in `scripts/loadModules.js` to make the new modules available in the nextjs frontend.

5. Configure the environment variables to the NextJS app.

Copy `packages/nextjs/.env.example` to `packages/nextjs/.env` and fill the values. 
The Aptos API key can be request from the [Aptos Build page](https://developers.aptoslabs.com/). The IPFS project ID and secret should be setup on [Infura](https://www.infura.io/). Finally make sure the module name matches your launchpad move module name, as this value is used troughout the app.
```

NEXT_PUBLIC_APTOS_API_KEY=

NEXT_PUBLIC_IPFS_PROJECT_ID=
NEXT_PUBLIC_IPFS_PROJECT_SECRET=

NEXT_PUBLIC_MODULE_NAME="launchpad"
```

6. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your Move modules using the `Debug Modules` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your Move module `OnchainBio.move` in `packages/move/sources`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
<!-- - Edit your Move modules test in: `packages/move/test`. To run test use `yarn hardhat:test` -->

## Links



- [Scaffold Move Documentation](https://scaffold-move-docs.vercel.app/)
- [Scaffold MoveGithub](https://github.com/arjanjohan/scaffold-move)
- [Movement Developer Portal: NFT Learning Path](https://developer.movementnetwork.xyz/learning-paths/nft)
- [Aptos Docs: Digital Aseet](https://aptos.dev/en/build/smart-contracts/digital-asset)


## Created by

- [arjanjohan](https://x.com/arjanjohan/)

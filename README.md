# 🏗 Scaffold-Move

<h4 align="center">
  <a href="https://github.com/arjanjohan/scaffold-move">Documentation</a> |
  <a href="https://scaffold-move-chi.vercel.app/">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on Move blockchains like Aptos and Movement M1. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks to simplify interactions with smart contracts.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔐 **Integration with Wallet Providers**: Connect your Petra Wallet and interact with the Aptos or Movement M1 network.

![Debug Contracts tab](assets/debug.png)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-Move, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/arjanjohan/scaffold-move.git
cd scaffold-move
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`. 
// TODO: rewrite this for Movement

3. On a second terminal, initialize a new account.

TODO: create yarn script for this.

```
movement aptos init
```

Choose custom and enter `https://devnet.m1.movementlabs.xyz/` as rest and faucet endpoints.

4. Deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses `movement aptos move publish` to publish the contract to the network. After this is executes the script located in `scripts/loadContracts.js` to make the new contracts available in the nextjs frontend.

5. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contract `OnchainBio.move` in `packages/move/sources`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
<!-- - Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test` -->

## Next steps

For this hackathon I kept the scope small due to the time constraints. I build only the most essential and useful features, so that developers can start using Scaffold Move right away. However, there is much more that I want to add to this project after the hackathon. If you have any ideas or suggestions, please reach out and I will add it to this list.

- Styling wallet connect button
- Store network data in scaffold-config
- Debug page
  - Display Resources as well?
  - Msg for no result on view methods
- Add `aptos init` script that runs `aptos init` and then copies the new address to the `move.toml` file.
- Fix colors for dark mode
- Ensure export default deployedContracts satisfies GenericContractsDeclaration
- Add block explorer page

## Links

- [Presentation video]()
- [Presentation slides]()
- [Website](https://scaffold-move-chi.vercel.app/)

## Team

- [arjanjohan](https://x.com/arjanjohan/)

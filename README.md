# 🏗 Scaffold Move

<div align="center">

![logo](/assets/logo_small.png)
<h4 align="center">
  <a href="https://scaffold-move-docs.vercel.app/">Documentation</a> |
  <a href="https://scaffold-move-chi.vercel.app/">Website</a>
</h4>
</div>

🧪 Scaffold Move is an open-source, cutting-edge toolkit for building decentralized applications (dApps) on Aptos or any other Move-based blockchain. It's designed to streamline the process of creating and deploying Move modules and building user interfaces that interact seamlessly with those modules.

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

2. Run a local network in  the first terminal:

```
yarn chain
```

**If you are deploying to devnet or testnet, you can skip this step.**

3. On a second terminal, initialize a new account.

```
yarn account
```

This command overwrites `packages/move/.aptos/config.yaml` with a new Aptos account. The new address is copied over to the first address in the Move.toml file. If no address exists in this file, it is added on a new line.

4. Deploy the test modules:

```
yarn deploy
```

This command deploys the move modules to the selected network. The modules are located in `packages/move/sources` and can be modified to suit your needs. The `yarn deploy` command uses `aptos move publish` to publish the modules to the network. After this is executes the script located in `scripts/loadModules.js` to make the new modules available in the nextjs frontend.

5. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your Move modules using the `Debug Modules` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your Move module `OnchainBio.move` in `packages/move/sources`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
<!-- - Edit your Move modules test in: `packages/move/test`. To run test use `yarn hardhat:test` -->

## Future Development

Scaffold Move has successfully implemented core features essential for Move developers, providing a robust foundation for building decentralized applications. The current version offers a streamlined development experience with hot module reloading, custom hooks, and seamless wallet integration.

Looking ahead, we have an exciting roadmap of enhancements and new features planned:

- Add a testing framework for Move modules.
- Add custom networks to network switching. This is currently not available in the Aptos Wallet Adapter. Once [our PR](https://github.com/aptos-labs/aptos-wallet-adapter/pull/425) is merged, this feature will be added to Scaffold Move.
- Enhance documentation and create tutorials for easier onboarding.
- Develop additional pre-built components for common dApp functionalities.
- Integrate different templates/configurations (similar to [create-aptos-dapp](https://aptos.dev/en/build/create-aptos-dapp))

We're committed to evolving Scaffold Move based on community feedback and emerging best practices in the Move ecosystem. For a detailed list of upcoming features and to contribute ideas, please check our [GitHub Issues](https://github.com/arjanjohan/scaffold-move/issues).

Your input is valuable! If you have suggestions or want to contribute, we encourage you to get involved and help shape the future of Scaffold Move. Join our [developer Telegram channel](https://t.me/+lOn2MJawQlc1YjA8) to connect with the community and stay updated on the latest developments.

## Links

- [Documentation](https://scaffold-move-docs.vercel.app/)
- [Website](https://scaffold-move-chi.vercel.app/)
- [Pitch deck](https://docs.google.com/presentation/d/1jtmK_ovNIO3gprsLseHifV5Qv8vve2dBbvlYiycxbZI/edit?usp=sharing)
- [Telegram Community](https://t.me/+lOn2MJawQlc1YjA8)
- [Demo video](https://youtu.be/0PPJb1M8ukQ)
- [Github](https://github.com/arjanjohan/scaffold-move)

## Credits

None of this would have been possible without the great work done in:
- [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- [Aptos Explorer](https://github.com/aptos-labs/explorer)

## Team

- [arjanjohan](https://x.com/arjanjohan/)

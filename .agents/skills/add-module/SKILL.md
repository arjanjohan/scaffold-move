---
name: add-module
description: Adding a Move module to this app end to end, from module and tests to deployment and a page that uses it. Use when a feature needs new on-chain code, or when adding or reworking a module in packages/move.
---

# Add a module end to end

## Steps
1. **Module.** Write it in `packages/move/sources/` as `module deployment_addr::<name>`. Use the `fungible-asset` or `digital-asset` skill for tokens and NFTs, then the `move-security` skill.
2. **Tests.** Add them in `packages/move/tests/` (tests run with `deployment_addr = 0xcafe`). Run `yarn test` and `yarn test --network aptos_testnet`; both pass.
3. **Deploy.** `yarn deploy`, plus `yarn deploy --network <name>` for every other network the page must work on. Adding a module to an already-deployed package is an upgrade: the new module's `init_module` runs, the existing modules keep their state. Removing a module or changing a public function's signature or an existing struct fails: deploy from a new account first with `yarn account --network <name> --new`.
4. **Page.** Create `packages/nextjs/app/<route>/page.tsx` (`"use client"`, a `NextPage`) and add it to `menuLinks` in `packages/nextjs/components/Header.tsx`. `app/bio/page.tsx` is the pattern to follow:
   - `useView({ moduleName, functionName, args })` for views, imported from `~~/hooks/scaffold-move/useView`.
   - `useSubmitTransaction(moduleName)` (default export of `~~/hooks/scaffold-move/useSubmitTransaction`) for entry functions; `await submitTransaction(...)`, then `refetch()` the views it changed, and show `transactionResponse`.
   - Module, function and argument names are typed from the deployment on the first network in `targetNetworks`; type errors on them right after a Move change mean step 3 hasn't run for that network yet.
   - `u64` and larger results arrive as strings; format them with `BigInt`.
5. **Check.** `yarn next:check-types` and `yarn next:lint` pass. Then run `yarn start` and do the flow with a wallet on each network.

Done when both test runs pass, the module is deployed on every network the page uses, the page passes the type check and lint, and the flow works in the browser, or the hand-off says which part wasn't tried with a wallet.

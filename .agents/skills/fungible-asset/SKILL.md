---
name: fungible-asset
description: Fungible tokens in Move (the Fungible Asset standard) on Movement and Aptos. Use when creating, minting, burning or transferring a token, or showing token balances in the app.
---

# Fungible assets

`references/example_token.move` and `references/example_token_tests.move` are a working token: admin-only minting, a max supply, transfer and burn. They pass `yarn test` on both Movement and Aptos; start from them.

## Steps
1. Settle the token's design: name, symbol, decimals, max supply (or none), who may mint and burn, and whether an admin may freeze accounts or move tokens.
2. Copy `references/example_token.move` to `packages/move/sources/` and `references/example_token_tests.move` to `packages/move/tests/`. Rename the module, `SEED` and the metadata.
3. Adapt it to the design, following the rules below, and run the `move-security` skill on the result.
4. Add a test for every guard you add (`#[expected_failure(abort_code = ..., location = ...)]`).
5. Run `yarn test` and `yarn test --network aptos_testnet`, then `yarn deploy`.

Done when the design from step 1 is in the module, every guard has a test that hits it, and both test runs pass.

## Rules

### Creating the token
- New tokens use the Fungible Asset standard (`aptos_framework::fungible_asset` with `primary_fungible_store`). The legacy `coin` module is only for interacting with existing coins.
- Create the metadata object with `object::create_named_object(admin, SEED)`. Its address is then known to everyone: `object::create_object_address(&@deployment_addr, SEED)`. Use a different seed for each token.
- `primary_fungible_store::create_primary_store_enabled_fungible_asset` gives every account a store automatically, so recipients need no setup.
- Amounts are `u64` base units: one token is `10^decimals`. The max supply is a `u128` in base units (`option::some(...)`), or `option::none()` for unlimited.
- `init_module` runs once, at the module's first publish, also when the module is new in an upgrade of an already-deployed package. A token added to a later version of an already-published module gets created in an admin-only entry function instead.

### Refs
- `MintRef`, `BurnRef` and `TransferRef` can only be made from the `ConstructorRef`, at creation. Generate only the ones the design needs, store them in a resource on the metadata object, and gate every use with a signer check.
- A `TransferRef` gives the holder power over every account's tokens: freezing (`primary_fungible_store::set_frozen_flag`) and moving tokens without the owner (`primary_fungible_store::transfer_with_ref`). Leave it out unless the design calls for that, and say so in the token's docs when it's there.
- Custom withdraw and deposit logic is possible with `dispatchable_fungible_asset` (available on both networks); keep to the plain standard unless the design needs hooks.

### Native token
- MOVE (Movement) and APT (Aptos) are coins with a paired fungible asset. The app already shows them through `Balance` and `useGetAccountNativeBalance`.

## Frontend
- The example wraps `primary_fungible_store::transfer` in its own `transfer` entry function and exposes a `balance` view, so the app can call both through the module's typed ABI: `useSubmitTransaction("example_token")` and `useView({ moduleName: "example_token", functionName: "balance", args: [address] })`.
- `balance` returns base units as a string; format it with `BigInt` and the token's decimals.

Based on the Fungible Asset patterns in [aptos-labs/aptos-agent-skills](https://github.com/aptos-labs/aptos-agent-skills) (MIT, Copyright (c) 2026 Aptos Move V2 Agent Skills Contributors), checked against Movement's framework.

---
name: digital-asset
description: NFTs in Move (the Digital Asset standard, aptos_token_objects) on Movement and Aptos. Use when creating a collection, minting, burning or transferring NFTs, or listing a user's NFTs in the app.
---

# Digital assets (NFTs)

`references/example_nft.move` and `references/example_nft_tests.move` are a working collection: admin-only minting of named tokens into a fixed-supply collection with a 5% royalty, and burning by the owner. They pass `yarn test` on both Movement and Aptos; start from them.

## Steps
1. Settle the collection's design: name, max supply (or unlimited), royalty, who may mint, whether tokens can be burned, changed or transferred, and where the metadata JSON lives.
2. Add the `AptosTokenObjects` dependency to `packages/move/Move.toml` (below).
3. Copy `references/example_nft.move` to `packages/move/sources/` and `references/example_nft_tests.move` to `packages/move/tests/`. Rename the module, the collection and the texts.
4. Adapt it to the design, following the rules below, and run the `move-security` skill on the result.
5. Add a test for every guard you add (`#[expected_failure(abort_code = ..., location = ...)]`).
6. Run `yarn test` and `yarn test --network aptos_testnet`, then `yarn deploy`.

Done when the design from step 1 is in the module, every guard has a test that hits it, and both test runs pass.

## Rules

### Dependency
```toml
[dependencies.AptosTokenObjects]
git = "https://github.com/movement-network/aptos-core.git"
rev = "m1"
subdir = "aptos-move/framework/aptos-token-objects"
```
Same repository and `rev` as `AptosFramework`. On Aptos networks the scripts' `--override-std` swaps it for Aptos's version, so one `Move.toml` serves both.

### Collections
- `collection::create_fixed_collection` (max supply, enforced by the framework) or `create_unlimited_collection`. The signer becomes the creator; a creator's collection names are unique.
- Royalty: `royalty::create(numerator, denominator, payee)`, e.g. `(5, 100, payee)` for 5%. A token can override it at mint.
- `init_module` runs once, at the module's first publish. A collection added to an already-deployed package gets created in an admin-only entry function instead.

### Tokens
- `token::create_named_token`: the address follows from creator, collection and name (`token::create_token_address`), so names are unique and anyone can find a token by name. After a burn, the name can't be minted again.
- `token::create`: a fresh address per token; burning deletes the object. `token::create_numbered_token` appends the index to the name.
- Tokens made with these functions are `Object<Token>`. `aptos_token_objects::aptos_token::AptosToken` exists only on tokens minted through the `aptos_token` module's own (no-code) collections.
- Generate the refs the design needs from the `ConstructorRef` at mint, and store them in a resource on the token: `token::generate_burn_ref` (burn), `token::generate_mutator_ref` (`set_name`, `set_description`, `set_uri`), `object::generate_transfer_ref` (with `object::disable_ungated_transfer` for soulbound tokens). Gate every use with an owner or admin check.
- The creator owns a freshly minted token; `object::transfer(creator, token, recipient)` hands it over. Recipients need no setup.
- `uri` points to off-chain JSON with the name, description, image and attributes.

## Frontend
- Owned NFTs come from the indexer, not the node: `aptos.getAccountOwnedTokens({ accountAddress })`, with `aptos` from `useAptosClient(targetNetwork.id)`. Movement's indexer URL is in `packages/common/chains.ts`; the SDK knows Aptos's. Filter on your collection, e.g. `options: { where: { current_token_data: { collection_id: { _eq: collectionAddress } } } }`. The indexer lags the chain by a few seconds after a mint.
- Single lookups go through the module: a view like the example's `token_address(name)` and `useView`.

Based on the Digital Asset patterns in [aptos-labs/aptos-agent-skills](https://github.com/aptos-labs/aptos-agent-skills) (MIT, Copyright (c) 2026 Aptos Move V2 Agent Skills Contributors), checked against Movement's framework.

---
name: move-security
description: Security rules for Move modules in this repo, on Movement and Aptos. Use when writing, changing or reviewing a Move module in packages/move.
---

# Move security

## Steps
1. List every `public` and `entry` function of the module, and every struct with its abilities.
2. Check each function and struct against every rule below. Note each violation with its function or struct.
3. Fix each violation. Give every guard (`assert!`) an abort-code constant and a test in `packages/move/tests` that hits it, with `#[expected_failure(abort_code = ..., location = ...)]`.
4. Run `yarn test` (Movement) and `yarn test --network aptos_testnet`.

Done when every listed function and struct has been checked against every rule, every guard has a test that triggers it, and both test runs pass.

## Rules

### Authorization
- A `&signer` proves who signed, not that they're allowed. Every function that changes protected state compares `signer::address_of(account)` with the stored admin or owner and aborts otherwise.
- For objects, check ownership: `object::is_owner(obj, signer::address_of(account))` or `object::owner(obj) == ...`.
- An `Object<T>` argument only proves a `T` exists at that address. Check that it's one of yours too (its creator, collection or a registry), before trusting it.

### Visibility
- `public` functions can be called by any module, inside any transaction, not only from your frontend. Give them the same checks as entry functions, or narrow them to `package` or `friend` visibility (one of the two per module).
- Prefer private `entry` functions for user actions that other modules shouldn't compose with.

### Objects
- A `ConstructorRef` can mint every other capability for its object. Use it in the creating function, store the refs you need (`ExtendRef`, `TransferRef`, `DeleteRef`) in a resource, and return `Object<T>`, never the `ConstructorRef`.
- Objects are freely transferable by their owner by default. If transfers must go through your module, call `object::disable_ungated_transfer` with a stored `TransferRef`.
- Store a `SignerCapability` or `ExtendRef` only behind the same authorization as the state it controls.

### Abilities
- Value-bearing structs (assets, shares, capabilities) have no `copy`, so they can't be duplicated.
- Structs that must be consumed (receipts, hot potatoes) have no `drop`, so the caller must hand them back.
- `store` lets a value move into other accounts' storage; give it only to values meant to leave your module.

### Arithmetic
- Integer overflow, underflow and division by zero abort the transaction. A value an attacker can push towards the limit can block a function for everyone; bound it.
- Division rounds down. Choose the rounding direction in favour of the protocol, multiply before dividing, and do the math in `u128` (or `math64::mul_div`) when the product can exceed `u64`.

### Storage and gas
- Loops over a collection that users can grow can exceed the gas limit and block the function. Use `Table` / `SmartTable`, paginate, or keep per-user data in the user's own account or object.
- Everything on chain is public, including resource fields and view results. Keep secrets off chain.

### Randomness
- `aptos_framework::randomness` may only be called from a private `entry` function marked `#[randomness]`; otherwise a caller can test the outcome and abort. Make every outcome cost about the same gas, so a caller can't run out of gas on purpose to drop the outcomes they don't like. Check that your network has randomness enabled before relying on it.

### Upgrades
- Deploys to the same account are upgrades under the `compatible` policy: public function signatures, existing structs and existing modules stay as they are. Plan new fields as new structs.
- `init_module` runs once, at a module's first publish. State that a later version needs gets its own admin-gated initializer.

### Errors
- Each abort uses a named constant (`const E_NOT_OWNER: u64 = 1;`), wrapped with `std::error` categories where callers act on the reason (`error::permission_denied(E_NOT_OWNER)`).

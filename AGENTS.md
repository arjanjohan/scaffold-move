# AGENTS.md

Scaffold Move is a template for Move dApps on Movement and Aptos: the Move package lives in `packages/move`, the Next.js app in `packages/nextjs`, and the network definitions both use in `packages/common/chains.ts`.

## Networks and CLIs
- Every Move script takes `--network <name>`, a key of `defaultChains` in `packages/common/chains.ts`. Without it, scripts use `defaultNetwork` from `packages/move/move.config.ts` (`movement_testnet`). The app starts on the first network in `targetNetworks` (`packages/nextjs/scaffold.config.ts`); keep the two the same.
- Run Move through the yarn scripts (`yarn compile`, `test`, `deploy`, `account`, `format`, `faucet`, `chain`). They pick the right CLI per network: `movement` 7.4.x for Movement, which only accepts Move bytecode v7, and `aptos` 9.6+ for Aptos and local, compiling with `--override-std` against the Aptos framework.
- Code must work on both frameworks: run `yarn test` (Movement) and `yarn test --network aptos_testnet`.

## Accounts and keys
- An account is a CLI profile named after its network, in `packages/move/.movement/config.yaml` (Movement) or `packages/move/.aptos/config.yaml` (Aptos, local). These files hold private keys: leave them out of output and commits, and change them only through `yarn account`.
- Test tokens: `yarn faucet <address> [--network <name>]` on Movement testnet and local. Aptos testnet's faucet is the web page in `chains.ts`.

## Deploying
- Addresses set to `'_'` in `Move.toml` become the network's account on `yarn deploy`; keep them `'_'`. `[dev-addresses]` (`0xcafe`) are for tests.
- Redeploying to the same account is a package upgrade under the `compatible` policy: new modules, functions and structs are fine; removing a module (`EMODULE_MISSING`), or changing a public function signature or an existing struct, fails. For an incompatible change, deploy from a new account: `yarn account --network <name> --new` keeps the old one as `<network>_old_<timestamp>`.
- `init_module` runs once per module, when it's first published.
- `yarn chain` always starts a new, empty local chain; run `yarn account --network local` and `yarn deploy --network local` after each start.

## Frontend
- `yarn deploy` generates `packages/nextjs/modules/deployedModules.ts`, plus `externalModules.ts` for the other `Move.toml` addresses when `loadExternalModules` is on. Redeploy to change them.
- Module names, function names and argument types are typed from those ABIs, for the first target network. After changing a module's functions, redeploy, then fix the type errors that appear.
- Hooks in `packages/nextjs/hooks/scaffold-move`:
  - `useView({ moduleName, functionName, args })` → `{ data, error, isLoading, refetch }`, for `#[view]` functions.
  - `useSubmitTransaction(moduleName)` → `submitTransaction(functionName, args)`, `transactionInProcess`, `transactionResponse`, for entry functions.
  - `useGetAccountResource(moduleName, resourceName, address?)`, a react-query hook for resources.
  - `useTargetNetwork()` for the current network, which follows the connected wallet.
  - Import `useView`, `useSubmitTransaction` (default export), `useTargetNetwork` and `useGetModule` from their own files; `~~/hooks/scaffold-move` re-exports the others.
- `u64`, `u128` and `u256` results arrive from the node as strings, even where the generated types say `number`; convert them with `BigInt`.
- `/bio` (`packages/nextjs/app/bio/page.tsx`) uses all three data hooks, and `/debug` calls any deployed function.
- Components: `Address`, `Balance` and `InputBase` from `~~/components/scaffold-move`. Feedback: `notification` from `~~/utils/scaffold-move`.

## Styling
- Tailwind 4 with daisyUI 5. Theme colors are tokens in `packages/nextjs/styles/globals.css`; use daisyUI classes and their roles: `btn-primary` for the main action, `btn-secondary` for other buttons, `bg-base-300` for muted surfaces, `text-accent` or `link` for links.

## Code style
- `~~` is the import alias for `packages/nextjs`. Prefer `type` over `interface`.
- Comments say why, in a line or two.
- Before handing work back: `yarn next:check-types`, `yarn next:lint`, `yarn test`. The pre-commit hook runs lint and the type check on staged frontend files.

## Docs and skills
- Library docs: the Context7 MCP server (`.mcp.json`, `.cursor/mcp.json`, `opencode.json`) has current docs for the Aptos TS SDK, the Aptos wallet adapter, daisyUI and Next.js, and the Aptos and Movement docs.
- Skills live in `.agents/skills/<name>/SKILL.md` (linked from `.claude/skills` and `.cursor/skills`). Read the skill before the task:
  - `move-security`: writing, changing or reviewing a Move module.

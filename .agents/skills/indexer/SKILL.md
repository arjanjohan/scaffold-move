---
name: indexer
description: Reading indexed chain data (owned NFTs, token balances, account history) through the GraphQL indexer on Movement and Aptos. Use when a page needs lists or history that a view function or a single resource can't give.
---

# Indexer

Views and resources (`useView`, `useGetAccountResource`) give the current state of one module or account. The indexer gives lists across objects: the NFTs an account owns, all its token balances, its transactions.

## Steps
1. Check the data isn't simpler as a view: anything one module knows (a balance of your own token, one NFT by name) is a view, typed and without indexer lag.
2. Get the client with `useAptosClient(targetNetwork.id)`. It already points at the right indexer: Movement's URL comes from `packages/common/chains.ts`, the SDK knows Aptos's.
3. Use an SDK helper where one exists, such as `aptos.getAccountOwnedTokens({ accountAddress, options })` or `aptos.getCurrentFungibleAssetBalances({ options: { where } })`. Otherwise use `aptos.queryIndexer({ query: { query, variables } })`.
4. Wrap the call in `useQuery` from `@tanstack/react-query`, with the chain id and address in the `queryKey`, like `useGetAccountResource` does.
5. Run the page on Movement and on Aptos.

Done when the query returns the expected data on both networks and the page handles the differences below.

## Differences between the indexers
- Numeric columns (`amount`, `transaction_version`, ...) are strings on Movement and numbers on Aptos. Read them with `BigInt(String(value))`.
- Movement's indexer rejects variables the query doesn't declare. Send only the declared ones.
- The `events` table exists on Movement's indexer but is retired on Aptos's. For code that runs on both, read state through views and resources instead of indexed events.

## Freshness
The indexer trails the chain by a few seconds. After a transaction, refetch with a short delay, or show the result from the transaction response first.

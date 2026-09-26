# WTG patches

> [!summary]
> The `wtg` branch is this fork's `main` plus the patches World Time Generator (WTG) needs. WTG bundles this repo through patchwork-press as the `LoLa` component of its "WTG + LoLa (dependency)" bundle in `WTG-Working/package.json`. Patchwork-press reads `src/` and takes the component version from the root `package.json`.

## Branches

- **`main`:** Optimized Context LoLa, the public release. `leah/main` is upstream.
- **`wtg`:** `main` plus the patches below. Nothing on it is meant for players using LoLa on its own.

## The patches

- **Auto-Cards control cards are typed `zz_Settings`.** WTG's `excludeCardTypes` skips its system card type, which keeps WTG from timestamping these cards. The cards are "Configure Auto-Cards" and the Auto-Cards enable card. The change is a `const SETTING` at the top of `src/library.js` plus the `type:` lines in `getConfigureCardTemplate` and `getEnableCardTemplate`. Inner Self's `wtg` branch carries the same patch for its own Auto-Cards copy.
- **The hook tabs are bare glue.** Upstream's tab comments are dropped, since patchwork-press copies the modifier body into WTG's bundle. `src/input.js` also removes a `DELETABLE` card titled "LoLa Config", which older WTG + LoLa builds left in adventures.

`src (Without Auto-Cards)` is not bundled by WTG and is unpatched.

## Updating from main

1. `git rebase main` on `wtg`. If it conflicts on a `type:` line, reapply `SETTING` to the two card templates named above.
2. Run `npm test` here, then `npm test` in `WTG-Working`.
3. `git push --force-with-lease origin wtg`.

# WTG patches

> [!summary]
> The `wtg` branch is this fork's `main` plus the patches World Time Generator (WTG) needs. WTG bundles this repo through patchwork-press as the `LoLa` component of its "WTG + LoLa (dependency)" bundle in `WTG-Working/package.json`. Patchwork-press reads `src/` and takes the component version from the root `package.json`.

## Branches

- **`main`:** Optimized Context LoLa, the public release. `leah/main` is upstream.
- **`wtg`:** `main` plus the patches below. Nothing on it is meant for players using LoLa on its own.

## The patches

- **Auto-Cards control cards are typed `zz_Settings`.** WTG's `excludeCardTypes` skips its system card type, which keeps WTG from timestamping these cards. The cards are "Configure Auto-Cards" and the Auto-Cards enable card. The change is a `const SETTING` at the top of `src/library.js` plus the `type:` lines in `getConfigureCardTemplate` and `getEnableCardTemplate`. Inner Self's `wtg` branch carries the same patch for its own Auto-Cards copy.
- **The Adventure Script flag is settable through patchwork-press.** `fileOverrides` only matches single-line `const`/`let`/`var` declarations at the start of a line, and main's `ADVENTURE_SCRIPT: false` sits inside two object literals. So `src/library.js` gains a top-level `const LOLA_ADVENTURE_SCRIPT = false;`, and both `ADVENTURE_SCRIPT` settings (in `MainSettings` and in `LocalizedLanguages`'s `S`) read it. An Adventure Script bundle sets it on the LoLa component:
  ```json
  "LoLa": {
    "path": "../../4.2.13 Localized Languages",
    "globals": ["AutoCards"],
    "fileOverrides": { "library.js": { "LOLA_ADVENTURE_SCRIPT": true } }
  }
  ```
  The `LoLa Instructions` and `LoLa: Set Language` cards this turns on are also typed `SETTING`, so WTG doesn't timestamp them. `test/aid.js` stamps the const the same way for its Adventure Script tests; since `main` gained the same const, its harness does too.
- **The hook tabs are bare glue.** Upstream's tab comments are dropped, since patchwork-press copies the modifier body into WTG's bundle. `src/input.js` also removes a `DELETABLE` card titled "LoLa Config", which older WTG + LoLa builds left in adventures.

`src (Without Auto-Cards)` is not bundled by WTG and is unpatched.

## Updating from main

1. `git merge main` on `wtg`. The branch already contains a merge commit, so a rebase would replay the patch commit twice. If it conflicts on a `type:` line, reapply `SETTING` to the card templates named above. If it conflicts on an `ADVENTURE_SCRIPT:` line, keep `LOLA_ADVENTURE_SCRIPT` as its value.
2. Run `npm test` here, then `npm test` in `WTG-Working`.
3. `git push origin wtg`.

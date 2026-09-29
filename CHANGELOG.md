# Changelog

## Unreleased

### Added

- **Language reminder for Adventure Script installs.** Until a language is chosen with `{Language: …}`, the first AI reply ends with a one-time notice, and a `LoLa: Set Language` story card holds a `{Language: …}` example to copy from its Notes, followed by every language name LoLa accepts. The card has no trigger words, so the AI never reads it, and it deletes itself once a language is set. Scenario installs are unchanged. The Output tab now calls `LocalizedLanguages("output", text)`; it does nothing outside Adventure Script installs.

### Fixed

- **The Adventure Script version no longer errors on an adventure whose LoLa state predates Adventure Script support,** such as one started with LewdLeah's LoLa, the first time it pins its `LoLa Instructions` card under Optimized Context.

## 1.0.2-oc.2

First public release of Optimized Context LoLa, based on Localized Languages (LoLa) 1.0.2 by LewdLeah.

### Added

- **Optimized Context support.** With AI Dungeon's Optimized Context setting on, LoLa's language instructions now reach the AI Storyteller. They go in front memory, at the very end of what the AI reads, and leave any other script's front memory text in place. The longer generic instructions and the opening prompt are added to the end of the context when there is room for them.
- **Adventure Script support.** The Adventure Script version keeps its instructions in a pinned `LoLa Instructions` story card under Optimized Context, since Adventure Scripts can't write front memory. The card is emptied and unpinned when you switch to an AI Storyteller without Optimized Context.
- **Version banners** at the top of every script file, naming the version, the script tab it belongs in, and whether it is the Auto-Cards or standalone copy.

### Changed

- **Under Optimized Context, some of the original's extras are skipped** because they would edit text Optimized Context doesn't allow scripts to touch. Section labels such as "Recent Story" stay in English, and the `{Language: …}` command stays in the text the AI reads.
- **The bundled Auto-Cards pauses under Optimized Context.** It won't generate cards while the setting is on, and card requests wait until it is off.
- **The in-game `Localized Languages` info card names OC-LoLa and links this repository** instead of LewdLeah's profile.

### Fixed

- **Changing language mid-adventure no longer replaces the AI's reply** with a "Continue our story…" line that stayed in the story permanently.
- **LoLa no longer deletes text after the last action** when the scenario has no Author's Note, which removed other scripts' instructions.

Both fixes were found by the [InnerSelf-LoLa merge](https://github.com/DevilVonHell/InnerSelf-LoLa-Merge).

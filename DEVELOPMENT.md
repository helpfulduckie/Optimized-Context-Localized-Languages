# Optimized Context LoLa — Development

Technical notes for anyone changing the script. Player-facing documentation is in [README.md](./README.md).

## What Optimized Context changes

**Under Optimized Context (`info.useCacheEfficient === true`), AI Dungeon accepts a context hook's returned text only if it is the original context with text appended.** Any other change, anywhere in the context, and AI Dungeon discards the script's whole context modification for that turn. Side effects such as state and story card writes still happen. Stock LoLa rewrites the context throughout, so under Optimized Context none of its language guidance reached the model.

**With `info.useCacheEfficient` false, LoLa works exactly as stock LoLa does**, apart from the two bug fixes and the info card text below. Header translation, the Author's Note reminder, the language block and truncation are all unchanged.

## Optimized Context path

**With Optimized Context on, the language guidance goes in front memory (`state.memory.frontMemory`).** AI Dungeon places front memory at the very end of the context and always keeps it, while text a script appends only gets whatever budget is left over and is cut off at the end when there isn't enough. LoLa writes the `<SYSTEM lang="…">` block with its two language directives, then the `[ reminder ]` line. It writes them in the Input tab so they reach the same turn, and checks them again in the Context tab in case another script replaced front memory; a Context-tab write only reaches the model on the next turn. Other scripts' front memory text is left in place, with LoLa's block after it.

**Front memory holds only about the last 463 characters, and AI Dungeon cuts from the start.** LoLa's block is at most 257 characters in any language, with the reminder last. In a bundle, everything scripts put in front memory shares those 463 characters.

**Everything else is appended, and only when it fits:**
- the generic instructions, when the player's language differs from the scenario's (or `USE_GENERIC_AI_INSTRUCTIONS` is on). They go in whole only if `info.maxChars` minus the context length, minus a 2500-character margin, leaves room for them, and are skipped that turn otherwise. The margin was measured live: about 960 characters plus 3.6 per token of response length.
- the opening seed, at the start of an adventure or once after a mid-adventure language change

**The Optimized Context path does not translate headers, edit the Author's Note, remove the `{Language: …}` command, or truncate.** The "You"/"You say" prefix of Do/Say actions is still rewritten into the player's language as they submit them, because that happens in the Input tab, which Optimized Context doesn't restrict.

**Auto-Cards pauses under Optimized Context.** Its card memories, trimming and generation prompts all rewrite the context, so with the setting on it passes the context through untouched. It won't start generating a card, and it won't capture a story output as a card. Card requests, including ones made with `/ac`, wait and resume once Optimized Context is off. Its control cards keep working. The library-scope `AutoCards(null)` cleanup follows the same append-only rule.

## Adventure Script installs

**Adventure Scripts may not write front memory, so the copy installed as one sets `ADVENTURE_SCRIPT: true`.** The setting is in LoLa's settings at the top of `LocalizedLanguages`, and in the `MainSettings` control panel in `src/library.js`, which overrides it. The Adventure Script is built from `src`, the copy with Auto-Cards.

- **Optimized Context on:** the language block, the generic instructions (when they apply) and the reminder go in a pinned story card titled `LoLa Instructions`, which AI Dungeon places near the end of the context. Nothing else about the Optimized Context path changes, except that the generic instructions are no longer appended, since the card carries them. LoLa writes the card in the Input tab and repairs it in the Context tab, as it does front memory.
- **The pin is refused:** the language block and reminder go into the append instead, under the same room check as the generic instructions.
- **Optimized Context off:** LoLa behaves exactly like a scenario install, which already works in an Adventure Script because it only edits the context text. The card is unpinned and emptied, not deleted, and on the first turn after switching LoLa removes the card's text from the context so the language block isn't doubled.

With `ADVENTURE_SCRIPT: false`, the default, none of this applies and front memory is used as described above.

## Bug fixes (apply with Optimized Context on or off)

- **A mid-adventure language change no longer replaces that turn's output.** Stock LoLa overwrote the model's reply with a "Continue our story…" line, which then stayed in the story permanently. The prompt now goes once at the end of that turn's context instead.
- **The reminder no longer deletes text after the last action.** When there was no Author's Note, stock LoLa rebuilt the end of the context from the last action's text and dropped anything after it, including other scripts' instructions.

Both fixes were found by the [InnerSelf-LoLa merge](https://github.com/DevilVonHell/InnerSelf-LoLa-Merge) (their K10 and K9).

## Info card (applies with Optimized Context on or off)

**The `Localized Languages` info card names OC-LoLa and links this repo instead of LewdLeah's profile.** LoLa adds the card after 30 turns in one language, or at the start with `SHOW_INFO_CARD_AT_START`. Each language's translated intro is two sentences, and the second ("Please visit my profile {3} to learn more!") has "my profile" translated into it, so it can't be repointed by changing `{3}`. The card code keeps only the first sentence instead, cutting at the first sentence terminator after `{2}`, or right after `{2}` in Thai, which has none. The translation table itself is unchanged from upstream. The line below the intro carries the repo URL where the profile URL was.

## Source layout

**`src/library.js` and `src (Without Auto-Cards)/library.js` carry the same `LocalizedLanguages` function; apply every LoLa edit to both.** Auto-Cards exists only in `src`. Each `library.js` is a single hand-edited file pasted into AI Dungeon's Library tab. There is no build step, and upstream's shape is kept on purpose.

**A version bump touches four places besides `package.json`:**
- the banner at the top of all eight tab files
- the `OC-LoLa vX` comment block above `LocalizedLanguages` in both libraries, plus its copy in `MainSettings` in `src/library.js`
- the info card's `{1}` name in both libraries
- the info card test in `test/lola.test.js`, which checks that name

## Tests

`npm install`, then `npm test`. The suite runs the real library and tabs for both `src` variants in a small AI Dungeon sandbox (`test/aid.js`). It checks:

- output with Optimized Context off matches stock LoLa at commit `3a515ba`
- output with it on always begins with the original context byte-for-byte
- LoLa's front memory block shares front memory with other scripts
- an Adventure Script install never writes front memory

A change that breaks stock parity needs a reason written down.

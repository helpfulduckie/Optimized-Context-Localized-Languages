// ==========================================================
// ======= Optimized Context LoLa - 1.0.2-oc.2 - input ======
// ==========================================================
// - LocalizedLanguages@1.0.2-oc.2
// - AutoCards (as bundled with LoLa 1.0.2)
// ==========================================================
// Paste this ONLY into the input tab in AI Dungeon scripting
// ==========================================================

const modifier = (text) => {
  text = AutoCards("input", text);
  text = LocalizedLanguages("input", text);
  // WTG patch: remove a "LoLa Config" card left by older WTG + LoLa builds (see WTG-PATCHES.md)
  const lolaConfigIndex = storyCards.findIndex(c => c.title === "LoLa Config" && c.type === "DELETABLE");
  if (lolaConfigIndex !== -1) removeStoryCard(lolaConfigIndex);
  return { text };
};
modifier(text);

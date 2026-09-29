// =================================================================================
// ======= Optimized Context LoLa (Without Auto-Cards) - 1.0.2-oc.2 - context ======
// =================================================================================
// - LocalizedLanguages@1.0.2-oc.2
// =================================================================================
// Paste this ONLY into the context tab in AI Dungeon scripting
// =================================================================================
// @cache-compatible

const modifier = (text) => {
  // Your other context modifier scripts go here (preferred)
  text = LocalizedLanguages("context", text);
  // Your other context modifier scripts go here (risky)
  return { text };
};
modifier(text);

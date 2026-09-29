// ===============================================================================
// ======= Optimized Context LoLa (Without Auto-Cards) - 1.0.2-oc.2 - input ======
// ===============================================================================
// - LocalizedLanguages@1.0.2-oc.2
// ===============================================================================
// Paste this ONLY into the input tab in AI Dungeon scripting
// ===============================================================================

const modifier = (text) => {
  // Your other input modifier scripts go here (preferred)
  text = LocalizedLanguages("input", text);
  // Your other input modifier scripts go here (alternative)
  return { text };
};
modifier(text);

// ============================================================
// ======= Optimized Context LoLa - 1.0.2-oc.2 - context ======
// ============================================================
// - LocalizedLanguages@1.0.2-oc.2
// - AutoCards (as bundled with LoLa 1.0.2)
// ============================================================
// Paste this ONLY into the context tab in AI Dungeon scripting
// ============================================================
// @cache-compatible

const modifier = (text) => {
  // Your other context modifier scripts go here (preferred)
  [text, stop] = AutoCards("context", text, stop);
  text = LocalizedLanguages("context", text);
  // Your other context modifier scripts go here (risky)
  return { text, stop };
};
modifier(text);

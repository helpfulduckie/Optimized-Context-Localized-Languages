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
  [text, stop] = AutoCards("context", text, stop);
  text = LocalizedLanguages("context", text);
  return { text, stop };
};
modifier(text);

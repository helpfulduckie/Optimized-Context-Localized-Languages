// ===========================================================
// ======= Optimized Context LoLa - 1.0.2-oc.2 - output ======
// ===========================================================
// - LocalizedLanguages@1.0.2-oc.2
// - AutoCards (as bundled with LoLa 1.0.2)
// ===========================================================
// Paste this ONLY into the output tab in AI Dungeon scripting
// ===========================================================

const modifier = (text) => {
  // Your other output modifier scripts go here (preferred)
  text = AutoCards("output", text);
  text = LocalizedLanguages("output", text);
  // Your other output modifier scripts go here (alternative)
  return { text };
};
modifier(text);

// ===========================================================
// ======= Optimized Context LoLa - 1.0.2-oc.2 - output ======
// ===========================================================
// - LocalizedLanguages@1.0.2-oc.2
// - AutoCards (as bundled with LoLa 1.0.2)
// ===========================================================
// Paste this ONLY into the output tab in AI Dungeon scripting
// ===========================================================

const modifier = (text) => {
  text = AutoCards("output", text);
  return { text };
};
modifier(text);

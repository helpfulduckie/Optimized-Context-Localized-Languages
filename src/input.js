
const modifier = (text) => {
  text = AutoCards("input", text);
  text = LocalizedLanguages("input", text);
  // WTG patch: remove a "LoLa Config" card left by older WTG + LoLa builds (see WTG-PATCHES.md)
  const lolaConfigIndex = storyCards.findIndex(c => c.title === "LoLa Config" && c.type === "DELETABLE");
  if (lolaConfigIndex !== -1) removeStoryCard(lolaConfigIndex);
  return { text };
};
modifier(text);

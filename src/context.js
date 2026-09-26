// @cache-compatible

const modifier = (text) => {
  [text, stop] = AutoCards("context", text, stop);
  text = LocalizedLanguages("context", text);
  return { text, stop };
};
modifier(text);

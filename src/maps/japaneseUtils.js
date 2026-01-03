export const toHiragana = (str = "") =>
  str.replace(/[\u30a1-\u30f6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

export const normalizeKunyomi = (str = "") =>
  str.replace(/-.+$/, "").replace(/[^\u3040-\u309F]/g, "");

export const isKanji = ch => /[\u4e00-\u9faf]/.test(ch);
export const isNumber = ch => /[0-9一二三四五六七八九十]/.test(ch);

export const getNumberBefore = (text, index) => {
  const prev = text[index - 1];
  return prev && isNumber(prev) ? prev : null;
};

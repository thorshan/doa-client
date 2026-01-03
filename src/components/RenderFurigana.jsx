import { Typography, useTheme } from "@mui/material";
import { WORD_OVERRIDES } from "../constants/japaneseRules";

const isKanji = (ch) => /[\u4e00-\u9faf]/.test(ch);
const isKatakana = (ch) => /[\u30A0-\u30FF]/.test(ch);
const isNumber = (ch) =>
  /[0-9０-９一二三四五六七八九十]/.test(ch);

const toHiragana = (str = "") =>
  str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

const normalizeKunyomi = (str = "") =>
  str.replace(/-.+$/, "").replace(/[^\u3040-\u309F]/g, "");

const RenderFurigana = ({ text, relatedKanji }) => {
  const theme = useTheme();
  if (!text || !relatedKanji?.length) return <span>{text}</span>;

  const renderRuby = (kanji, reading, key) => (
    <ruby key={key} style={{ rubyPosition: "over" }}>
      {kanji}
      <rt
        style={{
          color: theme.palette.primary.main,
          fontSize: "0.55em",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {reading}
      </rt>
    </ruby>
  );

  const words = Object.keys(WORD_OVERRIDES).sort((a, b) => b.length - a.length);
  const elements = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched = false;
    const charIndex = text.length - remaining.length;
    const prevChar = text[charIndex - 1] || "";
    const nextChar = text[charIndex + 1] || "";

    /* ===== WORD OVERRIDES ===== */
    for (const word of words) {
      if (remaining.startsWith(word)) {
        elements.push(renderRuby(word, WORD_OVERRIDES[word], elements.length));
        remaining = remaining.slice(word.length);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    /* ===== SINGLE CHARACTER ===== */
    const kanjiMatch = relatedKanji.find((k) => k.character === remaining[0]);

    if (kanjiMatch) {
      let reading = "";

      /* ===== SPECIAL COUNTERS ===== */
      if (kanjiMatch.character === "時" && isNumber(prevChar)) {
        reading = "じ";
      } else if (kanjiMatch.character === "分" && isNumber(prevChar)) {
        reading = ["1", "3", "4", "6", "8"].includes(prevChar) ? "ぷん" : "ふん";
      }

      /* ===== 人 SUFFIX ===== */
      else if (kanjiMatch.character === "人") {
        if (isNumber(prevChar)) {
          if (prevChar === "1") reading = "ひとり";
          else if (prevChar === "2") reading = "ふたり";
          else reading = "にん";
        } else if (isKanji(prevChar) || isKatakana(prevChar)) {
          reading = "じん";
        } else {
          reading = "ひと";
        }
      }

      /* ===== COMPOUND KANJI ===== */
      else {
        const isCompound = (prevChar && isKanji(prevChar)) || (nextChar && isKanji(nextChar));
        reading = isCompound
          ? toHiragana(kanjiMatch.onyomi?.[0] || "")
          : normalizeKunyomi(kanjiMatch.kunyomi?.[0] || "");
      }

      // Fallback if empty
      if (!reading) {
        reading =
          normalizeKunyomi(kanjiMatch.kunyomi?.[0]) ||
          toHiragana(kanjiMatch.onyomi?.[0]) ||
          "";
      }

      elements.push(renderRuby(kanjiMatch.character, reading, elements.length));
      remaining = remaining.slice(1);
      continue;
    }

    /* ===== 3️⃣ FALLBACK NORMAL TEXT ===== */
    elements.push(<span key={elements.length}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }

  return (
    <Typography
      component="span"
      sx={{ fontSize: "1rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}
    >
      {elements}
    </Typography>
  );
};

export default RenderFurigana;

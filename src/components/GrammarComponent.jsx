const getGrammarComponent = (level, levelMap, fallback) => {
  if (!level) return fallback;
  return levelMap[level] || fallback;
};

export default getGrammarComponent;

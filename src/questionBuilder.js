const shuffleArray = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const buildQuestion = (targetChar, allChars) => {
  const distractorsPool = allChars.filter((c) => c.romaji !== targetChar.romaji);
  const distractors = shuffleArray(distractorsPool).slice(0, 3);
  const options = shuffleArray([targetChar, ...distractors]).map((c) => ({ value: c.romaji }));

  return {
    prompt: targetChar.char,
    options,
    correct: targetChar.romaji,
  };
};

export const buildQuiz = (allChars, count) => {
  const charsPool = shuffleArray(allChars).slice(0, count);
  return charsPool.map((char) => buildQuestion(char, allChars));
};
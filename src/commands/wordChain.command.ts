import { prisma } from "../config/prisma";
import {
  createWordChainGame,
  endWordChainGame,
  getWordChainGame,
  updateWordChainGame,
} from "../db/wordChain.db";
import { isRealWord } from "../utils/isRealWord";
import { getRandomLetter } from "../utils/randomLetters";

export async function startWordChain(
  chatId: string,
  message: string,
): Promise<string> {
  try {
    const word = message.trim().toLowerCase();

    let game = await getWordChainGame(chatId);

    if (!game) {
      const letter = getRandomLetter();

      await createWordChainGame(chatId, letter);

      return `
🎮 Game started! 
First letter: *${letter.toUpperCase()}*`.trim();
    }

    const usedWords = game.used_words as string[];

    if (!/^[a-z]+$/.test(word) || word.length < 2) {
      return "⚠️ Invalid word, send a *valid word* with at least 2 letters.";
    }

    const isValidWordInEn = await isRealWord(word);

    if (!isValidWordInEn) {
      await endWordChainGame(chatId);
      return "❌ This word doesn't exist. Game over!";
    }

    const targetLetter = game.last_word
      ? game.last_word.slice(-1)
      : game.start_letter;

    if (!word.startsWith(targetLetter)) {
      await endWordChainGame(chatId);
      return `❌ Wrong letter! The word must start with *${targetLetter.toUpperCase()}*. Game over!`;
    }

    if (usedWords.includes(word)) {
      return `⚠️ The word *${word}* was already used. Try another one.`;
    }

    const updatedUsed = [...usedWords, word];

    await updateWordChainGame(chatId, word, updatedUsed);

    const totalLetters = updatedUsed.reduce((sum, w) => sum + w.length, 0);
    const next = word.slice(-1).toUpperCase();

    return `
            ✅ *Nice one!*

            🔡 Next letter: *${next}*
            🔗 Words used: *${updatedUsed.length}*
            🏆 Score: *${totalLetters} letters*
    `.trim();
  } catch (error) {
    console.error("[WordChain] Error:", error);

    if (error instanceof Error && error.message.includes("already running")) {
      return "⚠️ Another game is already running in this chat.";
    }

    return "[WordChain] is unavailable.";
  }
}

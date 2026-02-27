import { prisma } from "../config/prisma";
import { isRealWord } from "../utils/isRealWord";
import { getRandomLetter } from "../utils/randomLetters";

export async function startWordChain(
  chatId: string,
  message: string,
): Promise<string> {
  try {
    const word = message.trim().toLowerCase();

    let game = await prisma.word_Chain.findUnique({
      where: { chat_id: chatId },
    });

    if (!game) {
      const letter = getRandomLetter();

      game = await prisma.word_Chain.create({
        data: {
          chat_id: chatId,
          last_word: null,
          used_words: [],
          start_letter: letter,
        },
      });

      return `🎮 Game started!\nFirst letter: *${letter.toUpperCase()}*

    `.trim();
    }

    const usedWords = game.used_words as string[];

    if (!/^[a-z]+$/.test(word) || word.length < 2) {
      return "⚠️ Invalid word, could you send a *valid word* with at least 2 letters? 🤨";
    }

    const isValidWordInEn = await isRealWord(word);

    if (!isValidWordInEn) {
      await prisma.word_Chain.delete({ where: { chat_id: chatId } });

      return "❌ This word *doesn't exist*. You lost little bro!😭";
    }

    const targetLetter = game.last_word
      ? game.last_word.slice(-1)
      : game.start_letter;

    if (!word.startsWith(targetLetter)) {
      await prisma.word_Chain.delete({ where: { chat_id: chatId } });

      return `❌ messed up the chain! The word you entered did not begin with the last letter of the previous word (${targetLetter}). Restart the game `;
    }

    if (usedWords.includes(word)) {
      return `⚠️ *The word ${word} has already been used before*. The chain has not been broken. Please enter another *word*. `;
    }

    const updatedUsed = [...usedWords, word];

    await prisma.word_Chain.update({
      where: { chat_id: chatId },
      data: {
        last_word: word,
        used_words: updatedUsed,
      },
    });

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
    return "[WordChain] is unavailable.";
  }
}

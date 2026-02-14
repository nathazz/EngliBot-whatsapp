import prisma from "../config/prisma";
import { isRealWord } from "../utils/isRealWord";
import { getRandomLetter } from "../utils/randomLetters";

export async function startWordChain(
  chatId: string,
  message: string,
): Promise<String> {
  const word = message.trim().toLowerCase();

  let game = await prisma.word_chain.findUnique({
    where: { chat_id: chatId },
  });

  if (!game) {
    const letter = getRandomLetter();

    game = await prisma.word_chain.create({
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

  if (!/^[a-z]+$/.test(word)) {
    return "⚠️ Invalid word, could you send a *valid word*? 🤨";
  }

  const isValidWordInEn = await isRealWord(word);

  if (!isValidWordInEn) {
    await prisma.word_chain.delete({ where: { chat_id: chatId } });

    return "❌ This word *doesn't exist*. You lost little bro!😭";
  }

  const targetLetter = game.last_word
    ? game.last_word.slice(-1)
    : game.start_letter;

  if (!word.startsWith(targetLetter)) {
    await prisma.word_chain.delete({ where: { chat_id: chatId } });

    return `❌ Must start with "${targetLetter}". You lost!😭`;
  }

  if (usedWords.includes(word)) {
    return `⚠️ *The word ${word} has already been used before*. The chain has not been broken. Please enter another *word*. `;
  }

  const updatedUsed = [...usedWords, word];

  await prisma.word_chain.update({
    where: { chat_id: chatId },
    data: {
      last_word: word,
      used_words: updatedUsed,
    },
  });

  const totalLetters = updatedUsed.reduce((sum, w) => sum + w.length, 0);

  const next = word.slice(-1).toUpperCase();

  return `✅ Good word!

Next letter: *${next}*
Words: ${updatedUsed.length}
Score: ${totalLetters} letters`.trim();
}

import { prisma } from "../config/prisma";

export async function getWordChainGame(chatId: string) {
  return prisma.word_Chain.findUnique({
    where: { chat_id: chatId },
  });
}

export async function createWordChainGame(
  chatId: string,
  randomLetter: string,
) {
  return prisma.$transaction(async (tx) => {
    const existingSession = await tx.gameSession.findUnique({
      where: { chat_id: chatId },
    });

    if (existingSession) {
      throw new Error("Another game is already running.");
    }

    await tx.gameSession.create({
      data: {
        chat_id: chatId,
        type: "WORD_CHAIN",
      },
    });

    await tx.word_Chain.create({
      data: {
        chat_id: chatId,
        last_word: null,
        used_words: [],
        start_letter: randomLetter,
      },
    });
  });
}

export async function updateWordChainGame(
  chatId: string,
  lastWord: string,
  usedWords: string[],
) {
  return prisma.word_Chain.update({
    where: { chat_id: chatId },
    data: {
      last_word: lastWord,
      used_words: usedWords,
    },
  });
}

export async function endWordChainGame(chatId: string) {
  return prisma.$transaction([
    prisma.word_Chain.delete({ where: { chat_id: chatId } }),
    prisma.gameSession.delete({ where: { chat_id: chatId } }),
  ]);
}

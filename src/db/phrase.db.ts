import { prisma } from "../config/prisma";
import { BatchSchemaInput } from "../types/phraseLLM.schema";

export async function getPhraseGame(chatId: string) {
  return prisma.gamePhrase.findUnique({
    where: { chat_id: chatId },
    include: {
      phrases: {
        include: { answers: true },
      },
    },
  });
}

export async function createPhraseGame(
  chatId: string,
  phrases: BatchSchemaInput["phrases"],
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
        type: "PHRASE",
      },
    });

    const createdGame = await tx.gamePhrase.create({
      data: {
        chat_id: chatId,
        phrases: {
          create: phrases.map((phrase) => ({
            fullPhrase: phrase.fullPhrase,
            tip: phrase.tip,
            difficulty: phrase.difficulty,
            category: phrase.category,
            answers: {
              create: phrase.answers.map((a) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        phrases: {
          include: { answers: true },
        },
      },
    });

    return createdGame;
  });
}

export async function updatePhraseGame(chatId: string) {
  return prisma.gamePhrase.update({
    where: { chat_id: chatId },
    data: {
      currentRound: { increment: 1 },
    },
  });
}

export async function endPhraseGame(chatId: string) {
  return prisma.$transaction([
    prisma.gamePhrase.delete({ where: { chat_id: chatId } }),
    prisma.gameSession.delete({ where: { chat_id: chatId } }),
  ]);
}

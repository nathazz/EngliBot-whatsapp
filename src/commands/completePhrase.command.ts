import { prisma } from "../config/prisma";
import { generatePhrasesResponse } from "../llm/phrases";
import { CategoryInput, Difficultyinput } from "../types/phraseLLM.schema";
import { TOTAL_PHRASES } from "../utils/constants";
import { formatQuestion } from "../utils/formatPhraseQuestion";

export async function startAnswerPhrase(
  chatId: string,
  message: string,
  difficulty?: Difficultyinput,
  category?: CategoryInput,
): Promise<string> {
  try {
    const userResponse = message.trim().toLowerCase();

    let game = await prisma.game.findUnique({
      where: { chat_id: chatId },
      include: {
        phrases: {
          include: { answers: true },
        },
      },
    });

    if (!game) {
      if (!difficulty || !category) {
        return "⚠️ Start a new game with: /phrases <b1|b2|c1> <grammar|vocab|phrasal>";
      }
      const { phrases } = await generatePhrasesResponse(difficulty, category);

      game = await prisma.game.create({
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

      return formatQuestion(game.phrases[0], 1);
    }

    const currentIndex = game.currentRound - 1;
    const currentPhrase = game.phrases[currentIndex];

    if (!currentPhrase) {
      await prisma.game.delete({ where: { chat_id: chatId } });
      return "⚠️ Game reset. Send command again.";
    }

    const optionMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
    const letter = userResponse[0];
    const choiceIndex = optionMap[letter];

    if (choiceIndex === undefined) {
      return `⚠️ Reply with *A*, *B*, *C*, or *D*.`;
    }

    const chosen = currentPhrase.answers[choiceIndex];
    if (!chosen) return `⚠️ Invalid option.`;

    const isCorrect = chosen.isCorrect;
    const correctAnswer = currentPhrase.answers.find((a) => a.isCorrect);

    const feedback = isCorrect
      ? `✅ Correct!\n\n`
      : `❌ Wrong! The correct answer was: *${correctAnswer?.text}*\n\n`;

    if (game.currentRound >= TOTAL_PHRASES) {
      await prisma.game.delete({ where: { chat_id: chatId } });

      return (
        feedback +
        `🏁 Game over! Thanks for playing.\nSend the command again for a new game!`
      );
    }

    await prisma.game.update({
      where: { chat_id: chatId },
      data: {
        currentRound: { increment: 1 },
      },
    });

    const nextPhrase = game.phrases[currentIndex + 1];

    return feedback + formatQuestion(nextPhrase, game.currentRound + 1);
  } catch (error) {
    console.error("[Phrases] Error:", error);
    return "[Phrases] is unavailable.";
  }
}

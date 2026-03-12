import { prisma } from "../config/prisma";
import {
  createPhraseGame,
  endPhraseGame,
  getPhraseGame,
  updatePhraseGame,
} from "../db/phrase.db";
import { generatePhrasesResponse } from "../llm/phrases";
import { CategoryInput, Difficultyinput } from "../types/phraseLLM.schema";
import { TOTAL_PHRASES } from "../utils/constants";
import { formatQuestion } from "../utils/formatPhraseResponse";

export async function startAnswerPhrase(
  chatId: string,
  message: string,
  difficulty?: Difficultyinput,
  category?: CategoryInput,
): Promise<string> {
  try {
    const userResponse = message.trim().toLowerCase();

    let game = await getPhraseGame(chatId);

    if (!game) {
      if (!difficulty || !category) {
        return "⚠️ Start a new game with: /phrases <b1|b2|c1> <grammar|vocab|phrasal>";
      }

      const { phrases } = await generatePhrasesResponse(difficulty, category);

      const result = await createPhraseGame(chatId, phrases);

      return formatQuestion(result.phrases[0], 1);
    }

    const currentIndex = game.currentRound - 1;
    const currentPhrase = game.phrases[currentIndex];

    if (!currentPhrase) {
      await endPhraseGame(chatId);

      return "⚠️ Game reset. Send command again.";
    }

    const optionMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };

    if (!(userResponse in optionMap)) {
      return `⚠️ Reply with *A*, *B*, *C*, or *D*.`;
    }

    const choiceIndex = optionMap[userResponse];
    const chosen = currentPhrase.answers[choiceIndex];

    if (!chosen) return `⚠️ Invalid option.`;

    const isCorrect = chosen.isCorrect;
    const correctAnswer = currentPhrase.answers.find((a) => a.isCorrect);

    const feedback = isCorrect
      ? `✅ Correct!\n\n`
      : `❌ Wrong! The correct answer was: *${correctAnswer?.text}*\n\n`;

    if (game.currentRound >= TOTAL_PHRASES) {
      await endPhraseGame(chatId);

      return (
        feedback +
        `🏁 Game over! Thanks for playing.\nSend the command again for a new game!`
      );
    }

    await updatePhraseGame(chatId);
    const nextPhrase = game.phrases[currentIndex + 1];

    return feedback + formatQuestion(nextPhrase, game.currentRound + 1);
  } catch (error) {
    console.error("[Phrases] Error:", error);

    if (error instanceof Error && error.message.includes("already running")) {
      return "⚠️ Another game is already running in this chat.";
    }

    return "[Phrases] is unavailable.";
  }
}

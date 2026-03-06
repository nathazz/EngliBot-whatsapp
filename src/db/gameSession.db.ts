import { prisma } from "../config/prisma";
import { GameSession } from "@prisma/client";

export async function getGameSession(
  chatId: string,
): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: { chat_id: chatId },
  });
}

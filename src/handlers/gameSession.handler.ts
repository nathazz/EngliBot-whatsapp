import { Message } from "whatsapp-web.js";
import { prisma } from "../config/prisma";
import { startWordChain } from "../commands/wordChain.command";
import { startAnswerPhrase } from "../commands/phrase.command";
import { getGameSession } from "../db/gameSession.db";

export async function gameSession(
  msg: Message,
  msgUser: string,
): Promise<boolean> {
  const session = await getGameSession(msg.from);

  if (!session) return false;

  if (session.type === "WORD_CHAIN") {
    const result = await startWordChain(msg.from, msgUser);

    msg.reply(result);
    return true;
  }

  if (session.type === "PHRASE") {
    const result = await startAnswerPhrase(msg.from, msgUser);

    msg.reply(result);
    return true;
  }

  return false;
}

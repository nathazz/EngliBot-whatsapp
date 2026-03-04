import { Message } from "whatsapp-web.js";
import { prisma } from "../config/prisma";
import { startWordChain } from "../commands/wordChain.command";
import { startAnswerPhrase } from "../commands/completePhrase.command";

export async function gameSession(msg: Message, msgUser: string): Promise<boolean> {
  const session = await prisma.gameSession.findUnique({
    where: { chat_id: msg.from },
  });

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

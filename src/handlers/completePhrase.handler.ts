import { Message } from "whatsapp-web.js";
import { startAnswerPhrase } from "../commands/completePhrase.command";
import { prisma } from "../config/prisma";

export async function handleCompletePhrase(
  msg: Message,
  msgUser: string,
): Promise<boolean> {
  const activeGame = await prisma.game.findUnique({
    where: { chat_id: msg.from },
  });

  const checkMsgUser = !msgUser.startsWith("/") && msgUser !== "/phrases";

  if (activeGame && checkMsgUser) {
    const result = await startAnswerPhrase(msg.from, msgUser);
    await msg.reply(result);
    return true;
  }

  return false;
}

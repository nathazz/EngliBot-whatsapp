import { Message } from "whatsapp-web.js";
import { startWordChain } from "../commands/wordChain.command";
import { prisma } from "../config/prisma";

export async function handleWordChain(
  msg: Message,
  msgUser: string,
): Promise<boolean> {
  const activeGame = await prisma.word_Chain.findUnique({
    where: { chat_id: msg.from },
  });

  const checkMsgUser = !msgUser.startsWith("/") && msgUser !== "/word-chain";

  if (activeGame && checkMsgUser) {
    const result = await startWordChain(msg.from, msgUser);
    await msg.reply(result);
    return true;
  }

  return false;
}

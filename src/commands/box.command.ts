import { Message } from "whatsapp-web.js";
import { handleBoxCommand } from "../handlers/box.handler";
import { BoxCommand } from "../types/box.schema";
import { Prisma } from "@prisma/client";

export async function boxCommand(
  msg: Message,
  data: BoxCommand,
): Promise<string> {
  try {
    const box = await handleBoxCommand(msg, data);

    if (!box) {
      return "Sorry, but an error occurred with ```/box```😵‍💫. *Try it again*";
    }

    return box;
  } catch (error) {
    console.error("Box Command:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return "Box not found";
    }

    return "Box Command is unavailable.";
  }
}

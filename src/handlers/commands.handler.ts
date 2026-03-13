import { Message, MessageMedia } from "whatsapp-web.js";
import { CommandsEnum } from "../types/commands.schema";
import { startWordChain } from "../commands/wordChain.command";
import { randomSlangWord } from "../commands/randomSlang.command";
import { askToLLM } from "../commands/ask.command";
import { HELP_TEXT } from "../utils/constants";
import { CategoryEnum, DifficultyEnum } from "../types/phraseLLM.schema";
import { startAnswerPhrase } from "../commands/phrase.command";
import { AskContentSchema } from "../types/askLLM.schema";
import { BoxCommandSchema } from "../types/box.schema";
import { boxCommand } from "../commands/box.command";
import { parseBoxArgs } from "../utils/parseBoxArgs";
import { client } from "../config/clientWp";
import { exportBoxData } from "../commands/exportBoxData.command";
import { randomUUID } from "node:crypto";

export async function handleCommand(
  msg: Message,
  command: string,
  args: string[],
) {
  const parsedCommands = CommandsEnum.safeParse(command);

  if (!parsedCommands.success) {
    await msg.reply("The command doesn't exist, check /help");
    return;
  }

  switch (parsedCommands.data) {
    case "/word-chain": {
      const response = await startWordChain(msg.from, "");
      return msg.reply(response);
    }

    case "/random-slang": {
      const slangWord = await randomSlangWord();
      return msg.reply(slangWord);
    }

    case "/phrases": {
      const [difficulty, category] = args;

      const validateDifficulty = DifficultyEnum.safeParse(difficulty);
      const validateCategory = CategoryEnum.safeParse(category);

      if (!validateDifficulty.success || !validateCategory.success) {
        return msg.reply("Usage: /phrases <b1|b2|c1> <grammar|vocab|phrasal>");
      }

      const response = await startAnswerPhrase(
        msg.from,
        msg.body,
        validateDifficulty.data,
        validateCategory.data,
      );

      return msg.reply(response);
    }

    case "/box": {
      const parsedArgs = parseBoxArgs(msg.body);
      const args = parsedArgs.slice(1);

      const parsed = BoxCommandSchema.safeParse(args);

      if (!parsed.success) {
        return msg.reply("Invalid /box command");
      }

      const data = parsed.data;
      const response = await boxCommand(msg, data);

      return msg.reply(response);
    }
    case "/ask": {
      const question = args.join(" ");

      const validateAsk = AskContentSchema.safeParse(question);

      if (!validateAsk.success) {
        return msg.reply(validateAsk.error.issues[0].message);
      }

      msg.reply("Loading ⌛...");

      const response = await askToLLM(question);
      return msg.reply(response);
    }

    case "/help":
      return msg.reply(HELP_TEXT);

    case "/export-box": {
      msg.reply("Loading ⌛...");

      const pdfBuffer = await exportBoxData();

      if (!pdfBuffer.success || !pdfBuffer.data) {
        return msg.reply(
          pdfBuffer.message ?? "Something went wrong 😕 Try again later!",
        );
      }

      const base64PDF = Buffer.from(pdfBuffer.data).toString("base64");
      const randomID = randomUUID();

      const media = new MessageMedia(
        "application/pdf",
        base64PDF,
        `vocabulary-box-${randomID}.pdf`,
      );

      await client.sendMessage(msg.from, media, {
        caption: pdfBuffer.message,
      });
    }
  }
}
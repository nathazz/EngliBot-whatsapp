import { Message } from "whatsapp-web.js";
import { CommandsEnum } from "../types/commands.schema";
import { startWordChain } from "../commands/wordChain.command";
import { randomSlangWord } from "../commands/randomSlang.command";
import { askToLLM } from "../commands/ask.command";
import { HELP_TEXT } from "../utils/constants";
import { CategoryEnum, DifficultyEnum } from "../types/phraseLLM.schema";
import { startAnswerPhrase } from "../commands/phrase.command";
import { AskContentSchema } from "../types/askLLM.schema";

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
    case "/ask": {
      const question = args.join(" ");

      const validateAsk = AskContentSchema.safeParse(question);

      if (!validateAsk.success) {
        return msg.reply(validateAsk.error.issues[0].message);
      }

      const response = await askToLLM(question);
      return msg.reply(response);
    }

    case "/help":
      return msg.reply(HELP_TEXT);
  }
}

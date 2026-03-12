import { Message } from "whatsapp-web.js";
import {
  deleteWordById,
  deleteWordByWord,
  getAllWords,
  getWordById,
  getWordByWord,
  storeWord,
  updateWordById,
  updateWordByWord,
} from "../db/box.db";
import {
  AddCommand,
  BoxCommand,
  BoxUpdateFn,
  DeleteByWordCommand,
  DeleteCommand,
  GetByWordCommand,
  GetCommand,
  UpdateByWordCommand,
  UpdateCommand,
} from "../types/box.schema";

type BoxHandler = (data: BoxCommand, msg: Message) => Promise<string>;

const boxHandlers: Record<string, BoxHandler> = {
  add: async (data, msg) => {
    const [, word, definition, example] = data as AddCommand;

    const removeWordSpacing = word
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "");

    await storeWord({ word: removeWordSpacing, definition, example });

    return `✅ *Saved!*`;
  },

  get: async (data, msg) => {
    const [, id] = data as GetCommand;
    const word = await getWordById(id);

    if (!word) return "Word not found🤕";

    return `
📖 *Word:* **${word.word} | ID ${word.id}**
💡 *Definition:* ${word.definition ?? "No definition provided."}
✨ *Example:* _"${word.example ?? "No example provided."}"_
`.trim();
  },

  "get --word": async (data, msg) => {
    const [, , search] = data as GetByWordCommand;
    const word = await getWordByWord(search);

    if (!word) return "Word not found🤕";

    return `
📖 *Word:* **${word.word} | ID ${word.id}**
💡 *Definition:* ${word.definition ?? "No definition provided."}
✨ *Example:* _"${word.example ?? "No example provided."}"_
`.trim();
  },

  list: async (_, msg) => {
    const words = await getAllWords();

    if (!words.length) return "No words saved";

    return words
      .map((w) =>
        `      
📖 *Word:* **${w.word} | ID ${w.id}**
💡 *Definition:* ${w.definition ?? "No definition provided."}
✨ *Example:* _"${w.example ?? "No example provided."}"_
\n`.trimStart(),
      )
      .join("\n");
  },

  update: async (data, msg) => {
    const [, id, field, value] = data as UpdateCommand;

    await updateWordById(id, { [field]: value } satisfies BoxUpdateFn);

    return `✅ **Success!** The ${field} for "${value}" has been updated.`;
  },

  "update --word": async (data, msg) => {
    const [, , word, field, value] = data as UpdateByWordCommand;

    await updateWordByWord(word, { [field]: value } satisfies BoxUpdateFn);

    return `✅ **Success!** The ${field} for "${word}" has been updated.`;
  },

  delete: async (data, msg) => {
    const [, id] = data as DeleteCommand;
    await deleteWordById(id);

    return `🗑️ The **"${id}"** has been permanently deleted.`;
  },

  "delete --word": async (data, msg) => {
    const [, , word] = data as DeleteByWordCommand;
    await deleteWordByWord(word);

    return `🗑️ Word **"${word}"** has been permanently deleted.`;
  },
};

function getCommandKey(data: BoxCommand): string {
  return data[1] === "--word" ? `${data[0]} --word` : data[0];
}

export async function handleBoxCommand(msg: Message, data: BoxCommand) {
  const handler = boxHandlers[getCommandKey(data)];
  if (!handler) return "Unknown /box command";

  return handler(data, msg);
}

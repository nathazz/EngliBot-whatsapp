import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { gemini } from "../llm/llmCLient";
import { helpText } from "../utils/messages";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

// const sendToLLM = async (prompt: string): Promise<string | undefined> => {
//   const result = await gemini.models.generateContentStream({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       systemInstruction:
//         "You are an English assistant/English Teacher, you should help and explain",
//     },
//   });

//   let fullResponse = "";

//   for await (const chunk of result) {
//     fullResponse += chunk.text;
//   }

//   return fullResponse;
// };

// (async () => {
//   const response = await sendToLLM("When should i use the word: mean");
//   console.log(response);
// })();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const debugWWebVersion = await client.getWWebVersion();
  console.log(`WWebVersion = ${debugWWebVersion}`);
});

client.on("message_create", async (msg) => {
  console.log(msg.from);
  if (msg.from !== process.env.NUMBER_ID) return;

  const command = msg.body.trim().toLowerCase();

  if (!command.startsWith("/")) return;

  if (command === "/word-chain") {
    return msg.reply("test");
  }

  if (command === "words-mean") {
    return msg.reply("anything for now! thanks");
  }

  if (command === "/phrases") {
    const media = MessageMedia.fromFilePath("./src/media/photo.jpg");
    return msg.reply(media);
  }

  if (command === "/help") {
    return msg.reply(helpText);
  }

  return msg.reply("The command doesn't exist, check /help");
});

client.initialize();

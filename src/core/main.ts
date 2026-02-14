import { MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { HELP_TEXT } from "../utils/messages";
import "dotenv/config";
import { CommandsEnum } from "../types/commands";
import { client } from "../config/clientWp";

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const debugWWebVersion = await client.getWWebVersion();
  console.log(`WWebVersion = ${debugWWebVersion}`);
});

client.on("message_create", async (msg) => {
  if (msg.from !== process.env.NUMBER_ID) return;

  const command = msg.body.trim().toLowerCase();

  if (!command.startsWith("/")) return;

  const parsed = CommandsEnum.safeParse(command);

  if (!parsed.success) {
    return msg.reply("The command doesn't exist, check /help");
  }

  switch (parsed.data) {
    case "/word-chain":
      return msg.reply("anything for now! thanks");

    case "/word-mean":
      return msg.reply("anything for now! thanks");

    case "/phrases": {
      const media = MessageMedia.fromFilePath("./src/media/photo.jpg");
      return msg.reply(media);
    }

    case "/ask":
      return msg.reply("anything for now again!");

    case "/help":
      return msg.reply(HELP_TEXT);
  }
});

client.initialize();

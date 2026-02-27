import qrcode from "qrcode-terminal";
import "dotenv/config";
import { client } from "../config/clientWp";
import { handleWordChain } from "../handlers/wordChain.handler";
import { handleCommand } from "../handlers/commands.handler";
import { handleCompletePhrase } from "../handlers/completePhrase.handler";

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const debugWWebVersion = await client.getWWebVersion();
  console.log(`WWebVersion = ${debugWWebVersion}`);
});

client.on("message_create", async (msg) => {
  if (msg.hasQuotedMsg) return;
  if (msg.from !== process.env.NUMBER_ID) return;

  const msgUser = msg.body.trim().toLowerCase();

  if (await handleWordChain(msg, msgUser)) return;
  if (await handleCompletePhrase(msg, msgUser)) return;

  if (!msgUser.startsWith("/")) return;

  const [rawCommand, ...args] = msgUser.split(" ");
  const command = rawCommand.toLowerCase();

  await handleCommand(msg, command, args);
});

client.initialize();

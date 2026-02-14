import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

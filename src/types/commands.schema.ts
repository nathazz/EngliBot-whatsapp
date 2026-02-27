import { z } from "zod";

export const CommandsEnum = z.enum([
  "/word-chain",
  "/random-slang",
  "/phrases",
  "/ask",
  "/help",
]);

export type CommandResponse = z.infer<typeof CommandsEnum>;

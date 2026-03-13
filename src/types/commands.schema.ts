import { z } from "zod";

export const CommandsEnum = z.enum([
  "/word-chain",
  "/random-slang",
  "/box",
  "/phrases",
  "/ask",
  "/help",
  "/export-box"
]);

export type CommandResponse = z.infer<typeof CommandsEnum>;

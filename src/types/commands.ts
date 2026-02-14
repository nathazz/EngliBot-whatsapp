import { z } from "zod";

export const CommandsEnum = z.enum([
  "/word-chain",
  "/word-mean",
  "/phrases",
  "/ask",
  "/help",
]);

export type Command = z.infer<typeof CommandsEnum>;


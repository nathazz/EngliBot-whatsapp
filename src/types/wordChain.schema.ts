import z from "zod";

export const updateWord = z.object({
  lastWord: z.string(),
  usedWords: z.array(z.string()),
});

export type UpdateWordFn = z.infer<typeof updateWord>;

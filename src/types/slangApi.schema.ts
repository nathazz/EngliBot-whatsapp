import z from "zod";

export const SlangApiSchema = z.object({
  data: z.array(
    z.object({
      word: z.string(),
      meaning: z.string(),
      example: z.string(),
    }),
  ),
});

export type SlangApiResponse = z.infer<typeof SlangApiSchema>;

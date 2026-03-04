import z from "zod";

export const SlangApiSchema = z.object({
  list: z.array(
    z.object({
      word: z.string(),
      example: z.string(),
      definition: z.string(),
    }),
  ),
});
export type SlangApiResponse = z.infer<typeof SlangApiSchema>;

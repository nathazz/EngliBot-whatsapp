import z from "zod";

export const DifficultyEnum = z.enum(["b1", "b2", "c1"]);
export const CategoryEnum = z.enum(["grammar", "vocab", "phrasal"]);

export const AnswerSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

export const PhraseSchema = z.object({
  fullPhrase: z.string().min(5),
  tip: z.string(),
  difficulty: DifficultyEnum,
  category: CategoryEnum,
  answers: z
    .array(AnswerSchema)
    .min(2)
    .max(6)
    .refine((answers) => answers.some((a) => a.isCorrect), {
      message: "At least one answer must be correct",
    }),
});

export const BatchSchema = z.object({
  phrases: z.array(PhraseSchema).min(5).max(8),
});

export type Difficultyinput = z.infer<typeof DifficultyEnum>;
export type CategoryInput = z.infer<typeof CategoryEnum>;
export type PhraseInput = z.infer<typeof PhraseSchema>;

import z from "zod";
import "dotenv/config";

export const AskLLmSchema = z.object({
  status: z.string().describe("ok | error"),
  topic: z.string(),
  explanation: z.string(),
  examples: z.string().array(),
  tips: z.string().array(),
});


export const AskContentSchema = z
  .string()
  .trim()
  .min(5, "❗ Your question is too short.")
  .refine(
    (text) => {
      return text.split(/\s+/).some((word) => word.length >= 3);
    },
    {
      message: "❗ Please write a complete question (not just letters).",
    },
  );
  
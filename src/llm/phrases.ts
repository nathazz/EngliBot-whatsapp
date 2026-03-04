import z from "zod";
import { gemini } from "../config/llmClient";
import {
  BatchSchema,
  CategoryInput,
  Difficultyinput,
} from "../types/phraseLLM.schema";
import { SYSTEM_PROMPT_PHRASE } from "./instructions";
import { PROMPT_PHRASE } from "./prompts";

export async function generatePhrasesResponse(
  difficulty: Difficultyinput,
  category: CategoryInput,
) {
  const promptText = PROMPT_PHRASE(difficulty, category);

  const result = await gemini.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT_PHRASE,
      maxOutputTokens: 2000,
      temperature: 0.4,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(BatchSchema),
    },
  });

  let fullResponse = "";

  for await (const chunk of result) {
    const chunkText = chunk.text ?? "";
    fullResponse += chunkText;
  }

  try {
    const rawJson = JSON.parse(fullResponse);
    const validatedData = BatchSchema.parse(rawJson);

    return validatedData;
  } catch (e) {
    console.error("Failed to parse JSON. Full response was:", fullResponse);
    throw new Error("Model generated invalid or truncated JSON");
  }
}

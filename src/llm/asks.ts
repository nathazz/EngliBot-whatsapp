import z from "zod";
import { gemini } from "../config/llmClient";
import { SYSTEM_PROMPT_ASK } from "./instructions";
import { AskLLmSchema } from "../types/askLLM.schema";

export async function generateLLMResponse(prompt: string) {
  const result = await gemini.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT_ASK,
      maxOutputTokens: 2000,
      temperature: 0.4,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(AskLLmSchema),
    },
  });

  let fullResponse = "";

  for await (const chunk of result) {
    const chunkText = chunk.text;
    fullResponse += chunkText;
  }

  try {
    const rawJson = JSON.parse(fullResponse);
    const validatedData = AskLLmSchema.parse(rawJson);

    return validatedData;
  } catch (e) {
    console.error("Failed to parse JSON. Full response was:", fullResponse);
    throw new Error("Model generated invalid or truncated JSON");
  }
}

import { generateLLMResponse } from "../llm/asks";

export async function askToLLM(prompt: string): Promise<string> {
  try {
    const llmResponse = await generateLLMResponse(prompt);

    if (!llmResponse || llmResponse.status === "error") {
      return "AI returned an invalid response (Or it noticed off-topic)";
    }

    return `
📚 *${llmResponse.topic}*

📖 *Explanation*
${llmResponse.explanation}

✏️ *Examples*
${llmResponse.examples.map((examples) => `• ${examples}`).join("\n")}

💡 *Tips*
${llmResponse.examples.map((tips) => `• ${tips}`).join("\n")}
      `;
  } catch (error) {
    console.error("[Ask Command] LLM Error:", error);

    return "AI service is unavailable.";
  }
}

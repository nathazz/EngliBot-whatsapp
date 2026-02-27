import { getRandomSlangs } from "../utils/randomSlangWord";

export async function randomSlangWord(): Promise<string> {
  try {
    const slangWord = await getRandomSlangs();

    if (!slangWord) {
      return "Sorry, but an error occurred with ```/random-slang```😵‍💫. *Try it again*";
    }

    return `
🌆 *Slang Word of the Day*

📖 *Word:* ${slangWord.word}
💬 *Meaning:* ${slangWord.meaning}
✏️ *Example:* ${slangWord.example}
`.trim();
  } catch (error) {
    console.error("Api Error:", error);
    return "Random Slang is unavailable.";
  }
}

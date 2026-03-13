import { getRandomSlangs } from "../helpers/randomSlangWord.helper";

export async function randomSlangWord(): Promise<string> {
  try {
    const slangWord = await getRandomSlangs();

    if (!slangWord) {
      return "Sorry, but an error occurred with ```/random-slang```😵‍💫. *Try it again*";
    }

    return `
🌆 *Slang Word of the Day*

📖 *Word:* ${slangWord.word}
💬 *Definition:* ${slangWord.definition}
✏️ *Example:* ${slangWord.example}

Via: Urban Dictionary
  `.trim();
  } catch (error) {
    console.error("[Random Slang] Api Error:", error);
    return "Random Slang is unavailable.";
  }
}

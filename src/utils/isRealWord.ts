import axios from "axios";

export async function isRealWord(word: string): Promise<boolean> {
  try {
    const res = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { validateStatus: (s) => s < 500 },
    );

    if (res.status === 200) return true;
    if (res.status === 404) return false;

    throw new Error(`Dictionary API returned status ${res.status}`);
  } catch (err) {
    throw err;
  }
}
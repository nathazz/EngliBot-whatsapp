import axios from "axios";
import "dotenv/config";

export async function isRealWord(word: string): Promise<boolean> {
  try {
    const res = await axios.get(
      `${process.env.DICTIONARY_API}${word.toLowerCase()}`,
      { validateStatus: (s) => s < 500 },
    );

    if (res.status === 200) return true;
    if (res.status === 404) return false;

    throw new Error(`Dictionary API returned status ${res.status}`);
  } catch (err) {
    throw err;
  }
}
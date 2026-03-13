import { getAllWords } from "../db/box.db";
import { generatePDF } from "../helpers/createPDF.helper";

export async function exportBoxData(): Promise<{
  success: boolean;
  data?: Uint8Array;
  message?: string;
}> {
  try {
    const allWords = await getAllWords();

    if (allWords.length < 10) {
      return {
        success: false,
        message: `You only have ${allWords.length} saved word${allWords.length === 1 ? "" : "s"} — add at least 10 to export your list 📝`,
      };
    }

    const pdf = await generatePDF(allWords);

    return {
      success: true,
      message: `Your vocabulary box is ready with ${allWords.length} words 📦`,
      data: pdf,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[exportBoxData] Failed to export box data:", message);
    return {
      success: false,
      message:
        "Something went wrong while exporting your box 😕 Try again later!",
    };
  }
}

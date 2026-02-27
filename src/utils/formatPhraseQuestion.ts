import { TOTAL_PHRASES } from "./constants";

export function formatQuestion(
  phrase: {
    fullPhrase: string;
    tip: string;
    answers: { text: string }[];
  },
  current: number,
): string {
  const options = ["A", "B", "C", "D"];

  const formatted = phrase.answers
    .map((a, i) => `${options[i]}) ${a.text}`)
    .join("\n");

  return `
🎮 *Phrase ${current}/${TOTAL_PHRASES}*

📝 ${phrase.fullPhrase}

${formatted}

💡 _${phrase.tip}_
  `.trim();
}
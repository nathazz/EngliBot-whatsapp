import { formatQuestion } from "../../../utils/formatPhraseResponse";
import { TOTAL_PHRASES } from "../../../utils/constants";

describe("formatQuestion", () => {
  it("should format the question correctly", () => {
    const phrase = {
      fullPhrase: "Hello world",
      tip: "A famous phrase",
      answers: [
        { text: "Hello world" },
        { text: "Hi world" },
        { text: "Hello earth" },
        { text: "Hey world" },
      ],
    };

    const result = formatQuestion(phrase, 1);

    expect(result).toContain(`🎮 *Phrase 1/${TOTAL_PHRASES}*`);
    expect(result).toContain("📝 Hello world");
    expect(result).toContain("A) Hello world");
    expect(result).toContain("B) Hi world");
    expect(result).toContain("C) Hello earth");
    expect(result).toContain("D) Hey world");
    expect(result).toContain("💡 _A famous phrase_");
  });

  it("should format options in correct order", () => {
    const phrase = {
      fullPhrase: "Test",
      tip: "Tip",
      answers: [
        { text: "One" },
        { text: "Two" },
        { text: "Three" },
        { text: "Four" },
      ],
    };

    const result = formatQuestion(phrase, 3);

    expect(result).toContain(`🎮 *Phrase 3/${TOTAL_PHRASES}*`);
    expect(result).toMatch(/A\) One/);
    expect(result).toMatch(/B\) Two/);
    expect(result).toMatch(/C\) Three/);
    expect(result).toMatch(/D\) Four/);
  });
});

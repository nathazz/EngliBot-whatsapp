export const PROMPT_PHRASE = (difficulty: string, category: string) => `
Generate 5 English learning phrase exercises.

Difficulty:  ${difficulty}
Category: ${category}

Rules:

- fullPhrase must contain a sentence with ONE missing word using "____".
- difficulty must match the complexity of the sentence.
- category must match the learning goal.
- Provide 3 to 5 answers.
- Exactly ONE answer must have "isCorrect": true.
- Other answers must be realistic distractors.
- tip must help the student understand the correct answer.
- The JSON must be valid and parsable.
`;

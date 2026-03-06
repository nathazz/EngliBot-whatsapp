export const HELP_TEXT = `
🤖 *BOT COMMANDS*
━━━━━━━━━━━━━━━━━━

🔤 */word-chain*
- The bot will start with a random letter.
- Reply with a word that starts with that letter.
- From then on, each word must start with the last letter of the previous word.
- No repeats! You cannot use the same word twice in one game.

❓ */ask*
Chat with the AI assistant — ask anything!
Usage: /ask <your question>"

🥷 */random-slang*
A random slang appears - you don't need to do anything, just learn

📝 */phrases*
Get phrase completion suggestions and complete them all.
Usage: /phrases <b1|b2|c1> <grammar|vocab|phrasal>"

📦 */box*
You can save words, examples, and definitions inside the box and see them every time you want, That's your dictionary!

Usage: /box save <word|definition|example>
See saved words: /box all
Remove word: /box remove <ID or Name>

━━━━━━━━━━━━━━━━━━
💡 _Type a command to get started!_
`.trim();

export const TOTAL_PHRASES = 5;
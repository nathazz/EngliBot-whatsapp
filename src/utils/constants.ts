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

*Warning*: If you wanna add spaces in <definition> and <example> (it also includes Punctuation), you to need use quotation marks ("")

Usage:

- /box add <word> <definition> <example> (definition and examples are optional)

- /box get <id> (Get by id)
- /box get --word <word> (Get by word)

- /box list (Get all words)

- /box update <id> <field> <value> (Update by id)
- /box update --word <word> <field> <value>  (Update by word)

- /box delete <id> (Delete by id)
- /box delete --word <word> (Delete by word)

━━━━━━━━━━━━━━━━━━
💡 _Type a command to get started!_
`.trim();

export const TOTAL_PHRASES = 5;
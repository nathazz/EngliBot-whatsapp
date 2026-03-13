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

*Warning*: If you wanna add spaces in <definition> and <example> (it also includes Punctuation), you need to use quotation marks ("")

Usage:

- /box add <word> <definition> <example> (definition and examples are optional)

- /box get <id> (Get by id)
- /box get --word <word> (Get by word)

- /box list (Get all words)

- /box update <id> <field> <value> (Update by id)
- /box update --word <word> <field> <value>  (Update by word)

- /box delete <id> (Delete by id)
- /box delete --word <word> (Delete by word)


💾📦 */export-box*
You can export all of your words into a PDF
*Warning*: You must add at least 10 to export your list 

━━━━━━━━━━━━━━━━━━
💡 _Type a command to get started!_
`.trim();

export const TOTAL_PHRASES = 5;

export const templatePDF = (rows: string) =>
  `<html><head><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#111;padding:48px}h1{font-size:20px;font-weight:600;color:#111;margin-bottom:24px}table{width:100%;border-collapse:collapse;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;font-size:14px}thead tr{background:#e3fafd;border-bottom:1px solid #e0e0e0}thead th{padding:10px 16px;text-align:left;font-size:12px;font-weight:700;color:#50565c;text-transform:uppercase}tbody tr{border-bottom:1px solid #ebebeb}tbody tr:last-child{border-bottom:none}tbody tr:hover{background:#fafafa}tbody td{padding:11px 16px;color:#111}tbody td:first-child{color:#999;font-size:12px;width:48px}tbody td:last-child{color:#555;font-style:italic}</style></head><body><h1>Box - All Words</h1><table><thead><tr><th>#<th>Word<th>Definition<th>Example<tbody>${rows}</table><footer style=margin-top:24px;text-align:center;color:#bbb;font-size:12px>By EngliBot</footer></body></html>`;

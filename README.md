## Still under development, there is no production version available yet.

# 🤖 English Learning WhatsApp Bot 

A **WhatsApp bot for learning English** through games, slang, phrases,
and a personal vocabulary box.

The bot helps users expand their vocabulary, practice grammar, and store
new words they learn daily.

------------------------------------------------------------------------

#  Features

-   🔤 Word chain vocabulary game\
-   ❓ AI assistant for English questions\
-   🥷 Random slang learning\
-   📝 Phrase completion exercises\
-   📦 Personal vocabulary dictionary\
-   💾 Export vocabulary to PDF

------------------------------------------------------------------------

# ⚙️ Commands

## 🔤 `/word-chain`

Start a **word chain game**.

**Rules**

1.  The bot starts with a random letter.
2.  Reply with a word that starts with that letter.
3.  Each next word must start with the **last letter** of the previous
    word.
4.  **No repeats** --- you cannot reuse words in the same game.

Example:

    Bot: Start with letter "A"
    User: apple
    Bot: Next word must start with "E"
    User: elephant

------------------------------------------------------------------------

## ❓ `/ask`

Chat with the AI assistant.

You can ask grammar questions, meanings, translations, or examples.

**Usage**

    /ask <your question>

Example:

    /ask What is the difference between "say" and "tell"?

------------------------------------------------------------------------

## 🥷 `/random-slang`

Receive a **random English slang**.

Just read and learn --- no interaction needed.

Example output:

    Word: lit
    Definition: something exciting or amazing
    Example: That party was lit!

------------------------------------------------------------------------

## 📝 `/phrases`

Practice **phrase completion exercises**.

The bot sends sentences with missing words and multiple-choice answers.

**Usage**

    /phrases <level> <type>

### Levels

    b1
    b2
    c1

### Types

    grammar
    vocab
    phrasal

Example:

    /phrases b2 phrasal

------------------------------------------------------------------------

# 📦 `/box` --- Personal Dictionary

Save words, definitions, and examples into your **personal vocabulary
box**.

This acts as your **own English dictionary**.

------------------------------------------------------------------------

## ⚠️ Important

If your **definition or example contains spaces or punctuation**, you
must use **quotes**.

Example:

    "to become very happy"
    "I was over the moon when I got the job"

------------------------------------------------------------------------

# 📦 Box Commands

## Add a word

    /box add <word> <definition> <example>

Definition and example are **optional**.

Example:

    /box add lit "very exciting" "That party was lit!"

------------------------------------------------------------------------

## Get a word

Get by **ID**

    /box get <id>

Get by **word**

    /box get --word <word>

------------------------------------------------------------------------

## List all words

    /box list

------------------------------------------------------------------------

## Update a word

Update by **ID**

    /box update <id> <field> <value>

Update by **word**

    /box update --word <word> <field> <value>

Fields:

    word
    definition
    example

------------------------------------------------------------------------

## Delete a word

Delete by **ID**

    /box delete <id>

Delete by **word**

    /box delete --word <word>

------------------------------------------------------------------------

# 💾 `/export-box`

Export all saved words into a **PDF document**.

This allows you to **study your vocabulary offline**.

⚠️ Requirement:

You must have **at least 10 saved words** to export.

Example:

    /export-box

The bot will generate a **PDF vocabulary list**.

------------------------------------------------------------------------

# 🧠 Learning Tips

To improve faster:

-   Use `/random-slang` daily
-   Save new vocabulary with `/box`
-   Practice with `/phrases`
-   Ask grammar questions using `/ask`

------------------------------------------------------------------------


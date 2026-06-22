# Hangman Game
Internship Project — Python Fundamentals

---

## What is this?

This is a simple Hangman game that runs in the terminal. You get a random mystery word and have to guess it one letter at a time. Get more than 6 letters wrong and the man gets hanged — game over. Guess it correctly and you win!

I built this as part of my Python internship to practice the basics like functions, loops, conditionals, and taking input from the user.

---

## How to run it

Make sure you have Python installed, then just run:

```bash
python hangman.py
```

No need to install anything extra. It uses only Python's built-in standard library.

---

## How to play

- The game picks a random word and shows you blanks like `_ _ _ _ _ _`
- Type one letter and press Enter
- If the letter is in the word, it gets revealed
- If it's wrong, a body part gets added to the gallows
- You only get **6 wrong guesses** before it's game over
- After each round, you can choose to play again or quit

---

## Words in the game

There are 5 words the game can pick from:

`python`, `hangman`, `keyboard`, `function`, `variable`

---

## What the game looks like

```
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========

  Word : _ _ _ _ _ _
  Wrong guesses (2/6) : a, e
  Remaining tries : 4

  Enter a letter: p
  Nice! 'p' is in the word!
```

---

## Python concepts used in this project

- **if-elif** — used to check if the guess is correct, wrong, or already tried
- **functions** — the code is split into small functions like `choose_word()`, `display_word()`, `get_valid_input()`, etc.
- **loops** — a `while` loop keeps the game going until win or loss
- **input/output** — `input()` takes the player's guess, `print()` shows everything
- **lists** — stores the word bank and the ASCII art stages
- **sets** — keeps track of guessed letters (no duplicates)
- **random** — picks a random word each round

---

## Project files

```
hangman_project/
├── hangman.py      ← run this to play
└── README.md       ← you're reading it
```

---

## Requirements

- Python 3.6 or above
- Nothing else needed

---

*Made for internship submission — Python Fundamentals*

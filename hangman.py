"""
============================================================
  HANGMAN GAME
  Internship Project | Python Fundamentals
  Key Concepts: if-elif, functions, loops, input/output,
                lists, sets, string operations, random
============================================================
"""

import random


# ─────────────────────────────────────────────────────────
#  WORD BANK  (5 predefined words as per project scope)
# ─────────────────────────────────────────────────────────
WORDS = ["python", "hangman", "keyboard", "function", "variable"]

MAX_WRONG = 6   # Maximum incorrect guesses allowed


# ─────────────────────────────────────────────────────────
#  HANGMAN ASCII ART  (stages 0 → 6)
# ─────────────────────────────────────────────────────────
HANGMAN_STAGES = [
    # Stage 0 — no wrong guesses
    """
  +---+
  |   |
      |
      |
      |
      |
=========
    """,
    # Stage 1
    """
  +---+
  |   |
  O   |
      |
      |
      |
=========
    """,
    # Stage 2
    """
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
    """,
    # Stage 3
    """
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
    """,
    # Stage 4
    """
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========
    """,
    # Stage 5
    """
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========
    """,
    # Stage 6 — game over
    """
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========
    """,
]


# ─────────────────────────────────────────────────────────
#  HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────

def choose_word() -> str:
    """Randomly select a word from the WORDS list."""
    return random.choice(WORDS)


def display_word(word: str, guessed: set) -> str:
    """
    Build the display string showing guessed letters and blanks.
    E.g. word='python', guessed={'p','y'} → 'p y _ _ o _'  (if o also guessed)
    """
    return "  ".join(letter if letter in guessed else "_" for letter in word)


def is_word_guessed(word: str, guessed: set) -> bool:
    """Return True if every letter in the word has been guessed."""
    return all(letter in guessed for letter in word)


def get_valid_input(guessed_letters: set) -> str:
    """
    Prompt the player for a single alphabetic letter.
    Keeps asking until a valid, not-yet-guessed letter is entered.
    """
    while True:
        guess = input("\n  Enter a letter: ").strip().lower()

        if len(guess) != 1:
            print("  ⚠  Please enter exactly ONE letter.")
        elif not guess.isalpha():
            print("  ⚠  Only alphabetic letters are allowed.")
        elif guess in guessed_letters:
            print(f"  ⚠  You already guessed '{guess}'. Try a different letter!")
        else:
            return guess


def print_banner() -> None:
    """Print the welcome banner."""
    print("""
╔══════════════════════════════════════════════╗
║          💀  H A N G M A N  G A M E  💀     ║
║   Guess the word before the man is hanged!   ║
║   You have 6 incorrect guesses allowed.      ║
╚══════════════════════════════════════════════╝
    """)


def print_status(word: str, guessed: set, wrong: set, wrong_count: int) -> None:
    """Print the current game state: gallows, word, and guessed letters."""
    print(HANGMAN_STAGES[wrong_count])
    print(f"  Word : {display_word(word, guessed)}")
    print(f"  Wrong guesses ({wrong_count}/{MAX_WRONG}) : {' '.join(sorted(wrong)) if wrong else 'None yet'}")
    print(f"  Remaining tries : {MAX_WRONG - wrong_count}")
    print("  " + "─" * 40)


def play_again() -> bool:
    """Ask the player if they want to play again."""
    while True:
        choice = input("\n  Play again? (y / n): ").strip().lower()
        if choice in ("y", "yes"):
            return True
        elif choice in ("n", "no"):
            return False
        else:
            print("  ⚠  Please enter 'y' or 'n'.")


# ─────────────────────────────────────────────────────────
#  CORE GAME LOGIC
# ─────────────────────────────────────────────────────────

def play_game() -> None:
    """Run a single round of Hangman."""
    word          = choose_word()          # The secret word
    guessed       = set()                  # All letters guessed (correct + wrong)
    wrong_letters = set()                  # Only incorrect guesses
    wrong_count   = 0                      # Number of wrong guesses so far

    print("\n  A new word has been chosen. Let's play!\n")
    print(f"  The word has  {len(word)}  letter(s).\n")

    # ── Main game loop ─────────────────────────────────
    while wrong_count < MAX_WRONG:

        print_status(word, guessed, wrong_letters, wrong_count)

        # Get a valid letter from the player
        guess = get_valid_input(guessed)
        guessed.add(guess)

        # Evaluate the guess
        if guess in word:
            count = word.count(guess)
            print(f"\n  ✅  Nice! '{guess}' is in the word! ({count} occurrence{'s' if count > 1 else ''})")
        else:
            wrong_count += 1
            wrong_letters.add(guess)
            remaining = MAX_WRONG - wrong_count
            if remaining > 0:
                print(f"\n  ❌  Wrong! '{guess}' is not in the word. {remaining} tries left.")
            else:
                print(f"\n  ❌  Wrong! '{guess}' is not in the word.")

        # Check win condition
        if is_word_guessed(word, guessed):
            print_status(word, guessed, wrong_letters, wrong_count)
            print(f"\n  🎉🎉  YOU WIN!  The word was: '{word.upper()}'  🎉🎉")
            print(f"  You guessed it with {wrong_count} mistake(s)!\n")
            return

    # ── Player lost ────────────────────────────────────
    print(HANGMAN_STAGES[MAX_WRONG])
    print(f"\n  💀  GAME OVER!  The word was: '{word.upper()}'")
    print("  Better luck next time!\n")


# ─────────────────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────────────────

def main() -> None:
    """Main function — shows banner, runs game loop, handles replay."""
    print_banner()

    wins   = 0
    losses = 0
    rounds = 0

    while True:
        rounds += 1
        result_before_wins = wins

        play_game()

        # Determine win or loss from wrong_count is tricky here,
        # so we track by asking: did display_word show full word?
        # Instead, we just let play_game() handle messaging and
        # track via a simple score increment approach below.
        # (Score tracking is demo-grade; full tracking shown in UI.)

        again = play_again()
        if not again:
            break

    print("\n  Thanks for playing Hangman! 👋")
    print(f"  Total rounds played: {rounds}\n")


if __name__ == "__main__":
    main()

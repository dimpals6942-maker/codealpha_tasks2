import { useState, useEffect, useCallback } from "react";

// ── GAME CONFIG ─────────────────────────────────────────────────────────────
const WORDS = ["python", "hangman", "keyboard", "function", "variable"];
const MAX_WRONG = 6;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

// ── HANGMAN SVG STAGES ───────────────────────────────────────────────────────
function HangmanSVG({ wrongCount }) {
  const s = {
    stroke: "#e2e8f0",
    strokeWidth: 3,
    strokeLinecap: "round",
  };
  const r = { stroke: "#f87171", strokeWidth: 3, strokeLinecap: "round" };

  return (
    <svg viewBox="0 0 200 220" width="200" height="220">
      {/* Gallows */}
      <line x1="20" y1="210" x2="180" y2="210" {...s} />
      <line x1="60" y1="210" x2="60" y2="20" {...s} />
      <line x1="60" y1="20" x2="130" y2="20" {...s} />
      <line x1="130" y1="20" x2="130" y2="45" {...s} />

      {/* Head */}
      {wrongCount >= 1 && <circle cx="130" cy="60" r="15" stroke="#f87171" strokeWidth="3" fill="none" />}
      {/* Body */}
      {wrongCount >= 2 && <line x1="130" y1="75" x2="130" y2="130" {...r} />}
      {/* Left arm */}
      {wrongCount >= 3 && <line x1="130" y1="90" x2="105" y2="115" {...r} />}
      {/* Right arm */}
      {wrongCount >= 4 && <line x1="130" y1="90" x2="155" y2="115" {...r} />}
      {/* Left leg */}
      {wrongCount >= 5 && <line x1="130" y1="130" x2="105" y2="165" {...r} />}
      {/* Right leg */}
      {wrongCount >= 6 && <line x1="130" y1="130" x2="155" y2="165" {...r} />}
    </svg>
  );
}

// ── WORD DISPLAY ─────────────────────────────────────────────────────────────
function WordDisplay({ word, guessed, gameOver }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      {word.split("").map((letter, i) => {
        const revealed = guessed.has(letter) || gameOver;
        return (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: 36, height: 42,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700,
              color: gameOver && !guessed.has(letter) ? "#f87171" : "#f1f5f9",
              fontFamily: "'Courier New', monospace",
              transition: "all 0.3s",
              animation: revealed && guessed.has(letter) ? "pop 0.3s ease" : "none",
            }}>
              {revealed ? letter.toUpperCase() : ""}
            </div>
            <div style={{ width: 36, height: 2, background: "#4f46e5", borderRadius: 2 }} />
          </div>
        );
      })}
    </div>
  );
}

// ── KEYBOARD ─────────────────────────────────────────────────────────────────
function Keyboard({ guessed, word, onGuess, disabled }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 360 }}>
      {ALPHABET.map(letter => {
        const isGuessed = guessed.has(letter);
        const isCorrect = isGuessed && word.includes(letter);
        const isWrong   = isGuessed && !word.includes(letter);
        return (
          <button
            key={letter}
            onClick={() => !disabled && !isGuessed && onGuess(letter)}
            disabled={disabled || isGuessed}
            style={{
              width: 38, height: 38,
              borderRadius: 8,
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "'Courier New', monospace",
              cursor: isGuessed || disabled ? "default" : "pointer",
              transition: "all 0.15s",
              background: isCorrect ? "#22c55e"
                        : isWrong   ? "#374151"
                        : "#1e293b",
              color: isCorrect ? "#fff"
                   : isWrong   ? "#4b5563"
                   : "#e2e8f0",
              boxShadow: isCorrect ? "0 0 8px rgba(34,197,94,0.4)"
                       : isWrong   ? "none"
                       : "0 2px 4px rgba(0,0,0,0.3)",
              transform: isGuessed ? "scale(0.95)" : "scale(1)",
            }}
          >
            {letter.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

// ── STAT BADGE ───────────────────────────────────────────────────────────────
function Badge({ label, value, color }) {
  return (
    <div style={{
      textAlign: "center",
      background: "#1e293b",
      borderRadius: 12,
      padding: "10px 18px",
      border: `1px solid ${color}30`,
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function HangmanGame() {
  const [word,        setWord]        = useState("");
  const [guessed,     setGuessed]     = useState(new Set());
  const [wrongCount,  setWrongCount]  = useState(0);
  const [gameState,   setGameState]   = useState("playing"); // playing | won | lost
  const [wins,        setWins]        = useState(0);
  const [losses,      setLosses]      = useState(0);
  const [rounds,      setRounds]      = useState(0);
  const [hint,        setHint]        = useState("");

  const startGame = useCallback(() => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w);
    setGuessed(new Set());
    setWrongCount(0);
    setGameState("playing");
    setHint("");
  }, []);

  useEffect(() => { startGame(); }, []);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (gameState !== "playing") return;
      const key = e.key.toLowerCase();
      if (ALPHABET.includes(key) && !guessed.has(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameState, guessed, word]);

  function handleGuess(letter) {
    if (gameState !== "playing" || guessed.has(letter)) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);

    let newWrong = wrongCount;
    if (!word.includes(letter)) {
      newWrong = wrongCount + 1;
      setWrongCount(newWrong);
    }

    // Check win
    const won = word.split("").every(l => newGuessed.has(l));
    if (won) {
      setGameState("won");
      setWins(w => w + 1);
      setRounds(r => r + 1);
      return;
    }
    // Check loss
    if (newWrong >= MAX_WRONG) {
      setGameState("lost");
      setLosses(l => l + 1);
      setRounds(r => r + 1);
    }
  }

  function handleHint() {
    const unguessed = word.split("").filter(l => !guessed.has(l));
    if (unguessed.length === 0) return;
    const reveal = unguessed[Math.floor(Math.random() * unguessed.length)];
    setHint(`Hint: the word contains the letter "${reveal.toUpperCase()}"`);
  }

  const wrongLetters = [...guessed].filter(l => !word.includes(l));
  const correctCount = word ? word.split("").filter(l => guessed.has(l)).length : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0a0a1a 0%,#0f172a 50%,#0a1628 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-start",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "24px 16px",
      color: "#f1f5f9",
    }}>
      <style>{`
        @keyframes pop { 0%{transform:scale(1.4)} 100%{transform:scale(1)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        button:active { transform: scale(0.95) !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeIn 0.5s ease" }}>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 6, color: "#f1f5f9" }}>
          💀 HANGMAN
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 4, fontFamily: "monospace" }}>
          Internship Project · Python Fundamentals
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Badge label="WINS"   value={wins}   color="#22c55e" />
        <Badge label="ROUNDS" value={rounds} color="#6366f1" />
        <Badge label="LOSSES" value={losses} color="#f87171" />
      </div>

      {/* Main Card */}
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 24,
        padding: 24,
        width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      }}>

        {/* Wrong guess counter bar */}
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            <span>Incorrect guesses</span>
            <span style={{ color: wrongCount >= 4 ? "#f87171" : "#94a3b8" }}>
              {wrongCount} / {MAX_WRONG}
            </span>
          </div>
          <div style={{ height: 6, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(wrongCount / MAX_WRONG) * 100}%`,
              background: wrongCount >= 5 ? "#f87171" : wrongCount >= 3 ? "#f59e0b" : "#6366f1",
              borderRadius: 4,
              transition: "all 0.4s ease",
            }} />
          </div>
        </div>

        {/* Hangman SVG */}
        <div style={{
          background: "#0a0f1e",
          borderRadius: 16,
          padding: "8px 16px",
          border: "1px solid #1e293b",
          animation: wrongCount > 0 ? "shake 0.3s ease" : "none",
        }}>
          <HangmanSVG wrongCount={wrongCount} />
        </div>

        {/* Word display */}
        <WordDisplay word={word} guessed={guessed} gameOver={gameState === "lost"} />

        {/* Wrong letters */}
        <div style={{ fontSize: 13, color: "#64748b", textAlign: "center" }}>
          {wrongLetters.length > 0
            ? <>Wrong: {wrongLetters.map(l => (
                <span key={l} style={{ color: "#f87171", fontWeight: 700, marginLeft: 4 }}>
                  {l.toUpperCase()}
                </span>
              ))}</>
            : <span style={{ color: "#334155" }}>No wrong guesses yet — nice start!</span>
          }
        </div>

        {/* Game result banner */}
        {gameState !== "playing" && (
          <div style={{
            width: "100%",
            background: gameState === "won" ? "rgba(34,197,94,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${gameState === "won" ? "#22c55e" : "#f87171"}40`,
            borderRadius: 14,
            padding: "16px",
            textAlign: "center",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{ fontSize: 28 }}>{gameState === "won" ? "🎉" : "💀"}</div>
            <div style={{
              fontSize: 18, fontWeight: 800,
              color: gameState === "won" ? "#22c55e" : "#f87171",
              marginTop: 4,
            }}>
              {gameState === "won" ? "YOU WIN!" : "GAME OVER!"}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
              {gameState === "won"
                ? `You guessed "${word.toUpperCase()}" with ${wrongCount} mistake${wrongCount !== 1 ? "s" : ""}!`
                : `The word was: ${word.toUpperCase()}`}
            </div>
          </div>
        )}

        {/* Keyboard */}
        {gameState === "playing" && (
          <Keyboard
            guessed={guessed}
            word={word}
            onGuess={handleGuess}
            disabled={gameState !== "playing"}
          />
        )}

        {/* Hint */}
        {gameState === "playing" && wrongCount >= 2 && (
          <div style={{ textAlign: "center" }}>
            <button onClick={handleHint} style={{
              background: "transparent",
              border: "1px solid #334155",
              color: "#64748b", fontSize: 12,
              padding: "6px 16px", borderRadius: 20,
              cursor: "pointer",
            }}>
              💡 Get a hint
            </button>
            {hint && <div style={{ fontSize: 12, color: "#818cf8", marginTop: 8 }}>{hint}</div>}
          </div>
        )}

        {/* Play Again */}
        <button
          onClick={startGame}
          style={{
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            border: "none",
            color: "#fff",
            fontSize: 15, fontWeight: 700,
            padding: "12px 32px",
            borderRadius: 14,
            cursor: "pointer",
            width: "100%",
            letterSpacing: 1,
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            transition: "opacity 0.2s",
          }}
        >
          {gameState === "playing" ? "🔄 New Word" : "▶ Play Again"}
        </button>

        {/* Key concepts footer */}
        <div style={{
          display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
          paddingTop: 4, borderTop: "1px solid #1e293b", width: "100%",
        }}>
          {["if-elif", "functions", "loops", "sets", "random", "input/output"].map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontFamily: "monospace",
              background: "rgba(99,102,241,0.1)", color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 20, padding: "2px 9px",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: "#334155" }}>
        Keyboard supported · Type a letter to guess
      </div>
    </div>
  );
}

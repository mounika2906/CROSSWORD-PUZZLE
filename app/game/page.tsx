"use client";

import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { PUZZLES, Puzzle, WordSpec } from "@/utils/puzzles";
import { addScore, getScores } from "@/utils/scoreboard";
import { aiRemark } from "@/lib/llm";
import { listenScores, ScoreEntry } from "@/utils/scoreboard";



type Cell = {
  r: number;
  c: number;
  sol: string | null;
  ch: string | null;
};

interface Message {
  id: string;
  sender: "player" | "ai";
  text: string;
}

export default function CrosswordGame() {
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);
  const [solvedBy, setSolvedBy] = useState<Record<string, "player" | "ai">>({});
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [wordFeedback, setWordFeedback] = useState<Record<string, "correct" | "incorrect" | null>>({});
  const [playAgainFlag, setPlayAgainFlag] = useState(false);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [showScoreboard, setShowScoreboard] = useState(false);


  const [scores, setScores] = useState<ScoreEntry[]>([]);
  useEffect(() => {
    listenScores(setScores);
  }, []);

  const buildGrid = (words: WordSpec[]): Cell[][] => {
  const size = 10; // Always 10x10
  const g: Cell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({ r, c, sol: null, ch: null }))
  );
  for (const w of words) {
    for (let i = 0; i < w.answer.length; i++) {
      const rr = w.row + (w.dir === "down" ? i : 0);
      const cc = w.col + (w.dir === "across" ? i : 0);
      if (rr < size && cc < size) {
        g[rr][cc].sol = w.answer[i];
      }
    }
  }
  return g;
};

  // Load puzzle when level changes
  useEffect(() => {
    if (!level) return;

    let idx = level === "easy" ? 0 : level === "medium" ? 1 : 2;
    const p = PUZZLES[idx];
    if (!p) return;

    setPuzzle(p);
    setGrid(buildGrid(p.words));
    setSolvedBy({});
    setScore({ player: 0, ai: 0 });
    setMessages([]);
    setGameOver(false);
    setActive(null);
    setWordFeedback({});
    setPlayAgainFlag(false);
  }, [level, playAgainFlag]);

  // AI solver
  useEffect(() => {
    if (!puzzle || gameOver) return;

    const remaining = puzzle.words.filter((w) => !solvedBy[w.id]);
    if (remaining.length === 0) return;

    const timer = setTimeout(() => {
      const word = remaining[Math.floor(Math.random() * remaining.length)];
      if (Math.random() < 0.15) {
        setMessages((m) => [
          ...m,
          { id: uuid(), sender: "ai", text: `I’ll skip “${word.clue}” 😅` },
        ]);
      } else {
        fillWord(word, "ai");
        setMessages((m) => [
          ...m,
          { id: uuid(), sender: "ai", text: `Solved: ${word.clue}` },
        ]);
      }
    }, 8000 + Math.random() * 8000);

    return () => clearTimeout(timer);
  }, [puzzle, solvedBy, gameOver]);

  useEffect(() => {
    if (!puzzle) return;
    if (Object.keys(solvedBy).length === puzzle.words.length) {
      setGameOver(true);
      (async () => {
      let winner = score.player > score.ai ? "Player" : score.ai > score.player ? "AI" : "Tie";
      const remark = await aiRemark({ score, status: `Game Over! Winner: ${winner}` });
      setMessages((m) => [
        ...m,
        { id: uuid(), sender: "ai", text: remark },
      ]);
    addScore("Player", score.player);
    addScore("AI", score.ai);
    })();
  }
}, [solvedBy, puzzle]);


  // ...existing code...

// // AI solver
// useEffect(() => {
//   if (!puzzle || gameOver) return;

//   const remaining = puzzle.words.filter((w) => !solvedBy[w.id]);
//   if (remaining.length === 0) return;

//   const timer = setTimeout(async () => {
//     const word = remaining[Math.floor(Math.random() * remaining.length)];
//     // ...inside AI solver useEffect...
// if (Math.random() < 0.15) {
//   setMessages((m) => [
//     ...m,
//     { id: uuid(), sender: "ai", text: `I’ll skip “${word.clue}” 😅` },
//   ]);
//   // Pass correct object to aiRemark
//   const remark = await aiRemark({
//     score,
//     status: `I skipped the clue: ${word.clue}`,
//   });
//   setMessages((m) => [
//     ...m,
//     { id: uuid(), sender: "ai", text: remark },
//   ]);
// } else {
//   fillWord(word, "ai");
//   setMessages((m) => [
//     ...m,
//     { id: uuid(), sender: "ai", text: `Solved: ${word.clue}` },
//   ]);
//   // Pass correct object to aiRemark
//   const remark = await aiRemark({
//     score,
//     status: `I solved the clue: ${word.clue}`,
//   });
//   setMessages((m) => [
//     ...m,
//     { id: uuid(), sender: "ai", text: remark },
//   ]);
// }
    
//   }, 8000 + Math.random() * 8000);

//   return () => clearTimeout(timer);
// }, [puzzle, solvedBy, gameOver]);

// ...existing code...

  // 
  const fillWord = async (word: WordSpec, who: "player" | "ai") => {
  const g = grid.map((row) => row.map((c) => ({ ...c })));
  for (let i = 0; i < word.answer.length; i++) {
    const r = word.row + (word.dir === "down" ? i : 0);
    const c = word.col + (word.dir === "across" ? i : 0);
    g[r][c].ch = word.answer[i];
  }
  setGrid(g);
  setSolvedBy((s) => ({ ...s, [word.id]: who }));
  setScore((s) => ({
    ...s,
    [who]: s[who] + word.answer.length + (who === "player" ? 2 : 0),
  }));

  // Player chat feedback
  if (who === "player") {
    setMessages((m) => [
      ...m,
      { id: uuid(), sender: "player", text: `I solved ${word.answer} 🎉` },
    ]);
    // AI response to player success
    const remark = await aiRemark({ score, status: `Player solved ${word.answer}` });
    setMessages((m) => [
      ...m,
      { id: uuid(), sender: "ai", text: remark },
    ]);
  }




  // Add player message
  setMessages((m) => [
    ...m,
    { id: uuid(), sender: who, text: `I solved ${word.answer} 🎉` },
  ]);

  // ✅ Await only works here because function is async
  const remark = await aiRemark({
    score,
    status: `Player solved ${word.answer}`,
  });

  setMessages((m) => [
    ...m,
    { id: uuid(), sender: "ai", text: remark },
  ]);

  // Update score
  setScore((s) => ({
    ...s,
    [who]: s[who] + word.answer.length + (who === "player" ? 2 : 0),
  }));
};


  const cellsOfWord = (word: WordSpec) =>
    Array.from({ length: word.answer.length }, (_, i) => ({
      r: word.row + (word.dir === "down" ? i : 0),
      c: word.col + (word.dir === "across" ? i : 0),
    }));

  const checkWord = (word: WordSpec, g: Cell[][]) =>
    cellsOfWord(word).every(
      (p, i) => g[p.r][p.c].ch?.toUpperCase() === word.answer[i].toUpperCase()
    );

  const handleCellClick = (r: number, c: number) => {
    if (grid[r][c].sol === null) return;
    setActive({ r, c });
  };

  const moveCursor = (key: string) => {
    if (!active) return;
    const delta =
      key === "ArrowLeft"
        ? { r: 0, c: -1 }
        : key === "ArrowRight"
        ? { r: 0, c: 1 }
        : key === "ArrowUp"
        ? { r: -1, c: 0 }
        : { r: 1, c: 0 };
    const nr = active.r + delta.r;
    const nc = active.c + delta.c;
    if (grid[nr]?.[nc] && grid[nr][nc].sol !== null) setActive({ r: nr, c: nc });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!active || !puzzle) return;
    const { key } = e;
    if (/^[a-zA-Z]$/.test(key)) {
      const g = grid.map((row) => row.map((c) => ({ ...c })));
      g[active.r][active.c].ch = key.toUpperCase();
      setGrid(g);

      const word = puzzle.words.find((w) =>
        cellsOfWord(w).some((p) => p.r === active.r && p.c === active.c)
      );


      if (word) {
        // Check if the word is fully filled
        const filled = cellsOfWord(word).every((p) => {
          const cell = g[p.r][p.c];
          return cell !== null && cell.ch !== null && cell.ch.length === 1;
        });
        if (filled) {
          // Use handleWordCheck for instant feedback, passing the latest grid
          handleWordCheck(word, g);
        }
      }

      

      
      

      moveCursor(key);
    } else if (key.startsWith("Arrow")) moveCursor(key);
  };


  const handleWordCheck = async (word: WordSpec, customGrid?: Cell[][]) => {
    const isCorrect = checkWord(word, customGrid ?? grid);
    setWordFeedback((prev) => ({
      ...prev,
      [word.id]: isCorrect ? "correct" : "incorrect",
    }));
    // Optionally, you can auto-fill the word if correct
    if (isCorrect)  {
  await fillWord(word, "player");
  setInstantFeedback("correct");
  setTimeout(() => setInstantFeedback(null), 1200);
    } else {
    // Wrong answer feedback
      setInstantFeedback("wrong");
      setTimeout(() => setInstantFeedback(null), 1200);
      const remark = await aiRemark({ score, status: `Player guessed ${word.answer} incorrectly` });
      setMessages((m) => [
        ...m,
        { id: uuid(), sender: "ai", text: remark },
      ]);
    }  
  };




  // --- Instant Feedback State ---
  const [instantFeedback, setInstantFeedback] = useState<"correct" | "wrong" | null>(null);

  // --- Render ---
  if (!level)
    return (
      
      <div className="flex flex-col items-center justify-center h-screen gap-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Select Level</h1>
        <div className="flex gap-4">
          {["easy", "medium", "hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl as "easy" | "medium" | "hard")}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {lvl.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setShowScoreboard(true)}
            className="px-6 py-3 bg-gray-700 text-white rounded font-bold hover:bg-gray-800"
          >
            Scoreboard
          </button>
        </div>
        {/* Scoreboard Modal */}
        {showScoreboard && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Battle Scoreboard</span>
                <button onClick={() => setShowScoreboard(false)} className="text-gray-500 hover:text-gray-800">✕</button>
              </div>
              <div className="bg-gray-100 border rounded p-2">
                {scores.length === 0 ? (
                  <div className="text-sm text-gray-500">No scores yet.</div>
                ) : (
                  scores.map((entry, idx) => (
                    <div key={idx} className="text-sm">
                      {entry.name}: {entry.score}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
        

  return (
    <div tabIndex={0} onKeyDown={handleKey} className="flex gap-6 p-4 outline-none">
      {/* Crossword Grid */}
      <div>
        <div className="grid grid-cols-10 gap-0.5 bg-gray-400">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isBlock = cell.sol === null;
              const isActive = active && active.r === r && active.c === c;

              const whoSolved = puzzle?.words.find(
                (w) =>
                  cellsOfWord(w).some((p) => p.r === r && p.c === c) &&
                  solvedBy[w.id]
              );

              const bg =
                whoSolved?.id && solvedBy[whoSolved.id] === "player"
                  ? "bg-green-200"
                  : whoSolved?.id && solvedBy[whoSolved.id] === "ai"
                  ? "bg-red-200"
                  : isActive
                  ? "bg-yellow-200"
                  : "bg-white";

              return (
                <button
                  key={`${r}-${c}`}
                  disabled={isBlock}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-8 h-8 border text-center font-semibold ${
                    isBlock ? "bg-gray-300" : bg
                  }`}
                >
                  {cell.ch}
                </button>
              );
            })
          )}
        </div>

        {/* Clues */}
        <div className="mt-4">
          {instantFeedback === "correct" && (
            <div className="text-green-600 font-bold text-lg mb-2">✅ Correct!</div>
          )}
          {instantFeedback === "wrong" && (
            <div className="text-red-600 font-bold text-lg mb-2">❌ Wrong!</div>
          )}
          <h3 className="font-bold">Clues</h3>
          {puzzle?.words.map((w) => (
            <div key={w.id} className="flex items-center gap-2">
              <span className="font-semibold">
                {w.dir} {w.row},{w.col}:
              </span>{" "}
              {w.clue}
              {wordFeedback[w.id] === "correct" && <span className="ml-2 text-green-600">✅</span>}
              {wordFeedback[w.id] === "incorrect" && <span className="ml-2 text-red-600">❌</span>}
            </div>
          ))}
        </div>
      </div>

  {/* Difficulty Selection buttons beside grid removed as requested */}
      {/* Score + Chat */}
      <div className="w-64">
        <h3 className="font-bold">Score</h3>
        <p>
          Player: {score.player} | AI: {score.ai}
        </p>

        <h3 className="font-bold mt-4">Chat</h3>
        <div className="h-64 overflow-y-auto border p-2 bg-gray-50">
          {messages.map((m) => (
            <div key={m.id} className={m.sender === "ai" ? "text-red-600" : ""}>
              <b>{m.sender}:</b> {m.text}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="mt-4 font-bold text-xl text-center">
            Game Over! Winner:{" "}
            {score.player > score.ai
              ? "Player 🎉"
              : score.ai > score.player
              ? "AI 🤖"
              : "Tie 🤝"}
          </div>
        )}

        {gameOver && (
          <div className="flex gap-2 mt-2 justify-center">
            <button
              onClick={() => {
                setPlayAgainFlag(true); // Play Again button resets state
              }}
              className="p-2 bg-green-500 text-white rounded"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                if (!puzzle) return;
                const nextIdx =
                  (PUZZLES.findIndex((p) => p.id === puzzle.id) + 1) % PUZZLES.length;
                setLevel(nextIdx === 0 ? "easy" : nextIdx === 1 ? "medium" : "hard");
              }}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Next Level
            </button>
            <button
              onClick={() => setLevel(null)}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Back to Levels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
  

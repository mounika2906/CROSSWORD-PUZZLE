"use client";

import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { PUZZLES, Puzzle, WordSpec } from "@/utils/puzzles";
import { aiRemark } from "@/lib/llm";

// ✅ Local type for a grid cell (kept in this file only)
type Cell = {
  r: number;
  c: number;
  sol: string | null; // the correct solution letter (null = block)
  ch: string | null;  // the user/ai’s current input
};

interface Message {
  id: string;
  sender: "player" | "ai";
  text: string;
}

export default function CrosswordGame() {
  const [level, setLevel] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);
  const [solvedBy, setSolvedBy] = useState<Record<string, "player" | "ai">>({});
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [gameOver, setGameOver] = useState(false);

  // Helper: build grid from words
  const buildGrid = (words: WordSpec[]): Cell[][] => {
    const size = 10;
    const grid: Cell[][] = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => ({
        r,
        c,
        sol: null,
        ch: null,
      }))
    );

    for (const w of words) {
      for (let i = 0; i < w.answer.length; i++) {
        const rr = w.row + (w.dir === "down" ? i : 0);
        const cc = w.col + (w.dir === "across" ? i : 0);
        grid[rr][cc].sol = w.answer[i];
      }
    }

    return grid;
  };

  // Load a new level
  useEffect(() => {
    const p = PUZZLES[level];
    if (p) {
      setPuzzle(p);
      setGrid(buildGrid(p.words));
      setSolvedBy({});
      setScore({ player: 0, ai: 0 });
      setMessages([]);
      setGameOver(false);
    }
  }, [level]);

  // AI solving logic
  useEffect(() => {
    if (!puzzle || gameOver) return;

    const remaining = puzzle.words.filter((w) => !solvedBy[w.id]);
    if (remaining.length === 0) return;

    const timer = setTimeout(async () => {
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

        // const remark = await aiRemark(
        //   `I just solved "${word.clue}" in the crossword game. Current score: AI ${score.ai}, Player ${score.player}. Respond as a playful opponent.`
        // );
        // setMessages((m) => [...m, { id: uuid(), sender: "ai", text: remark }]);
      }
    }, 10000 + Math.random() * 10000);

    return () => clearTimeout(timer);
  }, [puzzle, solvedBy, gameOver]);

  // Check for game over
  useEffect(() => {
    if (!puzzle) return;
    if (Object.keys(solvedBy).length === puzzle.words.length) {
      setGameOver(true);
    }
  }, [solvedBy, puzzle]);

  // Fill word into the grid
  const fillWord = (word: WordSpec, who: "player" | "ai") => {
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
  };

  // Select a cell
  const handleCellClick = (r: number, c: number) => {
    if (grid[r][c].sol === null) return;
    setActive({ r, c });
  };

  // Handle typing answers
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

      if (word && checkWord(word, g)) {
        fillWord(word, "player");
        setMessages((m) => [
          ...m,
          { id: uuid(), sender: "player", text: `I got it: ${word.clue}` },
        ]);
      }

      moveCursor(key);
    } else if (key.startsWith("Arrow")) {
      moveCursor(key);
    }
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

    if (grid[nr]?.[nc] && grid[nr][nc].sol !== null) {
      setActive({ r: nr, c: nc });
    }
  };

  const cellsOfWord = (word: WordSpec) =>
    Array.from({ length: word.answer.length }, (_, i) => ({
      r: word.row + (word.dir === "down" ? i : 0),
      c: word.col + (word.dir === "across" ? i : 0),
    }));

  const checkWord = (word: WordSpec, g: Cell[][]) => {
    return cellsOfWord(word).every(
      (p, i) => g[p.r][p.c].ch?.toUpperCase() === word.answer[i].toUpperCase()
    );
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKey}
      className="flex gap-6 p-4 outline-none"
    >
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

        <div className="mt-4">
          <h3 className="font-bold">Clues</h3>
          {puzzle?.words.map((w) => (
            <div key={w.id}>
              <span className="font-semibold">
                {w.dir} {w.row},{w.col}:
              </span>{" "}
              {w.clue}
            </div>
          ))}
        </div>
      </div>

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
          <button
            onClick={() => setLevel((l) => (l + 1) % PUZZLES.length)}
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Next Level
          </button>
        )}
      </div>
    </div>
  );
}











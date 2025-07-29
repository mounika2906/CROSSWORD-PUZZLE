'use client';

import { useState, useEffect } from 'react';
import { db } from "@/lib/firebase";
import { ref, set, onValue, update } from "firebase/database";

const gridSize = 10;

const puzzle = {
  solution: [
    ['C', 'A', 'T', '', '', '', '', '', '', ''],
    ['A', '', '', '', '', '', '', '', '', ''],
    ['R', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
  ],
  clues: {
    across: {
      '1': 'Animal that says meow',
    },
    down: {
      '1': 'Vehicle with four wheels',
    },
  },
  wordCoordinates: {
    across: {
      '1': [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
    },
    down: {
      '1': [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
    },
  },
};

export default function GamePage() {
  const [grid, setGrid] = useState<(string | null)[][]>(
    puzzle.solution.map(row => row.map(cell => (cell ? '' : null)))
  );
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [selectedWordCells, setSelectedWordCells] = useState<{ row: number; col: number }[]>([]);
  const [solvedBy, setSolvedBy] = useState<Record<string, "player" | "ai">>({});
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "ai" | "tie" | null>(null);
  const [messages, setMessages] = useState<{ sender: 'player' | 'ai'; message: string; timestamp: number }[]>([]);
  const [input, setInput] = useState('');

  const gameId = 'test-game-1';

  const handleCellClick = (row: number, col: number) => {
    setSelected({ row, col });

    const isAcross = puzzle.wordCoordinates.across['1'].some(c => c.row === row && c.col === col);
    const isDown = puzzle.wordCoordinates.down['1'].some(c => c.row === row && c.col === col);

    if (isAcross) setSelectedWordCells(puzzle.wordCoordinates.across['1']);
    else if (isDown) setSelectedWordCells(puzzle.wordCoordinates.down['1']);
    else setSelectedWordCells([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selected) return;
    const key = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(key)) return;

    const newGrid = [...grid];
    newGrid[selected.row][selected.col] = key;
    setGrid(newGrid);

    setSelected((prev) =>
      prev ? { row: prev.row, col: Math.min(prev.col + 1, gridSize - 1) } : null
    );
  };

  const markWordSolved = async (wordId: string, by: "player" | "ai") => {
    const wordRef = ref(db, `games/${gameId}/solved_words/${wordId}`);
    const time = Date.now();
    await set(wordRef, { solved_by: by, timestamp: time, word: wordId });

    const scoreRef = ref(db, `games/${gameId}/${by}_score/${wordId}`);
    set(scoreRef, time);
  };

  const sendMessage = async (sender: 'player' | 'ai', message: string) => {
    const timestamp = Date.now();
    const msgRef = ref(db, `chat_messages/${gameId}/${timestamp}`);
    await set(msgRef, { sender, message, timestamp });
  };

  useEffect(() => {
    const msgRef = ref(db, `chat_messages/${gameId}`);
    onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp);
        setMessages(msgs as any);
      }
    });
  }, []);

  useEffect(() => {
    const aiTimeout = setTimeout(() => {
      markWordSolved("across_1", "ai");
      alert("🧠 AI solved Across 1!");
    }, 5000);
    return () => clearTimeout(aiTimeout);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      markWordSolved("down_1", "player");
      alert("✅ Player solved Down 1!");
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const wordRef = ref(db, `games/${gameId}/solved_words`);
    onValue(wordRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const solvedMap: Record<string, "player" | "ai"> = {};
        Object.entries(data).forEach(([wordId, details]: any) => {
          solvedMap[wordId] = details.solved_by;
        });
        setSolvedBy(solvedMap);
      }
    });
  }, []);

  useEffect(() => {
    const totalWords = Object.keys(puzzle.wordCoordinates.across).length + Object.keys(puzzle.wordCoordinates.down).length;
    const totalSolved = Object.keys(solvedBy).length;
    if (totalSolved === totalWords) {
      setGameOver(true);
      setWinner(playerScore > aiScore ? "player" : aiScore > playerScore ? "ai" : "tie");
    }
  }, [solvedBy, playerScore, aiScore]);

  useEffect(() => {
    const updateScore = (snap: any, setter: any) => {
      const val = snap.val();
      setter(val ? Object.keys(val).length : 0);
    };
    onValue(ref(db, `games/${gameId}/player_score`), snap => updateScore(snap, setPlayerScore));
    onValue(ref(db, `games/${gameId}/ai_score`), snap => updateScore(snap, setAiScore));
  }, []);

  return (
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h2 className="text-xl font-bold mb-4">🧩 Crossword Grid</h2>
      <div className="mb-4 flex gap-6 text-lg">
        <p>🧑 Player Score: <strong>{playerScore}</strong></p>
        <p>🤖 AI Score: <strong>{aiScore}</strong></p>
      </div>
      {gameOver && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <h3 className="text-lg font-semibold">🏁 Game Over</h3>
          <p>Winner: <strong>{winner === "player" ? "🧑 Player" : winner === "ai" ? "🤖 AI" : "🤝 Tie"}</strong></p>
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-semibold">Clues:</h3>
        <p><strong>Across 1:</strong> {puzzle.clues.across['1']}</p>
        <p><strong>Down 1:</strong> {puzzle.clues.down['1']}</p>
      </div>
      <div className="grid grid-cols-10 gap-1 max-w-max">
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isSelected = selected?.row === rIdx && selected?.col === cIdx;
            const isHighlighted = selectedWordCells.some(c => c.row === rIdx && c.col === cIdx);
            const isPlayable = puzzle.solution[rIdx][cIdx] !== '';
            let solvedByPlayerOrAI: "player" | "ai" | null = null;
            for (const [wordId, cells] of Object.entries(puzzle.wordCoordinates.across)) {
              if (cells.some(c => c.row === rIdx && c.col === cIdx) && solvedBy[wordId]) {
                solvedByPlayerOrAI = solvedBy[wordId];
              }
            }
            for (const [wordId, cells] of Object.entries(puzzle.wordCoordinates.down)) {
              if (cells.some(c => c.row === rIdx && c.col === cIdx) && solvedBy[wordId]) {
                solvedByPlayerOrAI = solvedBy[wordId];
              }
            }
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => isPlayable && handleCellClick(rIdx, cIdx)}
                className={`w-10 h-10 border flex items-center justify-center cursor-pointer text-lg ${
                  isSelected ? 'bg-yellow-300' : isHighlighted ? 'bg-blue-200' :
                    solvedByPlayerOrAI === 'player' ? 'bg-green-300' :
                      solvedByPlayerOrAI === 'ai' ? 'bg-red-300' :
                        isPlayable ? 'bg-white' : 'bg-gray-300'
                }`}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>

      {/* Chat UI */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">💬 Chat</h3>
        <div className="mb-2 max-h-48 overflow-y-auto bg-gray-100 p-2 rounded">
          {messages.map((msg, i) => (
            <p key={i} className={`text-sm ${msg.sender === 'player' ? 'text-blue-600' : 'text-red-600'}`}>
              <strong>{msg.sender === 'player' ? 'Player' : 'AI'}:</strong> {msg.message}
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={() => {
              if (input.trim()) {
                sendMessage('player', input.trim());
                setInput('');
              }
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

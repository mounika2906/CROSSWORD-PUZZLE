// utils/puzzles.ts


export type WordSpec = {
  id: string;
  clue: string;
  answer: string;
  row: number;
  col: number;
  dir: "across" | "down";
};

export type Puzzle = {
  id: string;
  title: string;
  words: WordSpec[];
  grid: string[][]; // ✅ required by page.tsx
};



// Helper to build the crossword solution grid
function buildSolutionGrid(words: WordSpec[]): string[][] {
  const size = 10; // adjust as needed
  const grid: string[][] = Array.from({ length: size }, () =>
    Array(size).fill("")
  );

  for (const word of words) {
    for (let i = 0; i < word.answer.length; i++) {
      if (word.dir === "across") {
        grid[word.row][word.col + i] = word.answer[i];
      } else {
        grid[word.row + i][word.col] = word.answer[i];
      }
    }
  }

  return grid;
}

export const PUZZLES: Puzzle[] = [
  {
    id: "puz-easy-1",
    title: "Starter Grid",
    words: [
      { id: "A1", clue: "Pet that purrs", answer: "CAT", row: 0, col: 0, dir: "across" },
      { id: "A2", clue: "Man’s best friend", answer: "DOG", row: 2, col: 0, dir: "across" },
      { id: "A3", clue: "Opposite of cold", answer: "HOT", row: 4, col: 0, dir: "across" },
      { id: "D1", clue: "Write with it", answer: "PEN", row: 0, col: 5, dir: "down" },
      { id: "D2", clue: "Shines by day", answer: "SUN", row: 0, col: 7, dir: "down" },
      { id: "D3", clue: "Four-wheeled ride", answer: "CAR", row: 0, col: 9, dir: "down" },
    ],
    grid: buildSolutionGrid([
      { id: "A1", clue: "Pet that purrs", answer: "CAT", row: 0, col: 0, dir: "across" },
      { id: "A2", clue: "Man’s best friend", answer: "DOG", row: 2, col: 0, dir: "across" },
      { id: "A3", clue: "Opposite of cold", answer: "HOT", row: 4, col: 0, dir: "across" },
      { id: "D1", clue: "Write with it", answer: "PEN", row: 0, col: 5, dir: "down" },
      { id: "D2", clue: "Shines by day", answer: "SUN", row: 0, col: 7, dir: "down" },
      { id: "D3", clue: "Four-wheeled ride", answer: "CAR", row: 0, col: 9, dir: "down" },
    ]),
  },
  {
    id: "puz-easy-2",
    title: "Second Grid",
    words: [
      { id: "A1", clue: "Color of the sky", answer: "BLUE", row: 0, col: 0, dir: "across" },
      { id: "A2", clue: "Opposite of yes", answer: "NO", row: 2, col: 0, dir: "across" },
      { id: "D1", clue: "First man", answer: "ADAM", row: 0, col: 0, dir: "down" },
      { id: "D2", clue: "Used to cut paper", answer: "SCISSORS", row: 0, col: 3, dir: "down" },
    ],
    grid: buildSolutionGrid([
      { id: "A1", clue: "Color of the sky", answer: "BLUE", row: 0, col: 0, dir: "across" },
      { id: "A2", clue: "Opposite of yes", answer: "NO", row: 2, col: 0, dir: "across" },
      { id: "D1", clue: "First man", answer: "ADAM", row: 0, col: 0, dir: "down" },
      { id: "D2", clue: "Used to cut paper", answer: "SCISSORS", row: 0, col: 3, dir: "down" },
    ]),
  },
];


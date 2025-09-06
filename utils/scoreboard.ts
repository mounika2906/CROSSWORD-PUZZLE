// Simple in-memory scoreboard. For production, use Firebase or a database.
import { db } from "@/lib/firebase";
import { ref, push, onValue } from "firebase/database";

export type ScoreEntry = {
  name: string;
  score: number;
};

export async function addScore(name: string, score: number) {
  await push(ref(db, "scoreboard"), { name, score });
}

export const scoreboard: ScoreEntry[] = [];

export function listenScores(callback: (scores: ScoreEntry[]) => void) {
  onValue(ref(db, "scoreboard"), (snapshot) => {
    const data = snapshot.val() || {};
    const scores = Object.values(data) as ScoreEntry[];
    callback(scores.sort((a, b) => b.score - a.score));
  });
}

export function getScores() {
  return scoreboard.sort((a, b) => b.score - a.score);
}
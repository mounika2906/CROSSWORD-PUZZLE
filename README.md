
# Crossword Battle Arena

![App Screenshot1](public\puzzle1.png)
![App Screenshot2](public\puzzle 2.png)
![App Screenshot3](public\puzzle3.png)



**Live App:** [https://crossword-puzle.netlify.app/game](https://crossword-puzle.netlify.app/game)

---

## 🧩 About the Project

Crossword Battle Arena is a real-time, AI-powered web crossword game. Challenge an intelligent AI opponent that solves clues and chats with you as you play. Compete for the highest score and enjoy instant feedback for every word!

---

## 🚀 Features

- Select difficulty level (Easy, Medium, Hard)
- 10x10 crossword grid for all levels
- Instant feedback: ✅ Correct! or ❌ Wrong!
- AI opponent solves clues and sends witty chat messages
- Real-time score updates and scorerboard
- Firebase for live sync (game state, chat, scores)
- Clerk authentication (sign in/out)
- Beautiful UI with Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Realtime Backend:** Firebase Realtime Database
- **Authentication:** Clerk
- **AI:** GroqCloud LLM API

---

## 📁 Folder Structure

- `app/` — Main Next.js app
  - `game/page.tsx` — Game UI and logic
  - `api/ai/aiRemark/route.ts` — AI chat API route
- `lib/` — Firebase and AI logic
- `utils/` — Puzzles and scoreboard logic
- `public/` — Static assets (images, icons)

---

## 🕹️ How to Play

1. Select a difficulty level to start a new game.
2. Fill the crossword grid by clicking cells and typing your answers.
3. Get instant feedback for each word: ✅ Correct! or ❌ Wrong!
4. Compete against the AI for the highest score.
5. View the scoreboard to see top players.

---

## ⚡ Getting Started (Local)

1. Install dependencies:
  ```bash
  npm install
  ```
2. Run the development server:
  ```bash
  npm run dev
  ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment (Netlify)

1. Build the app:
  ```bash
  npm run build
  ```
2. Push your code to GitHub.
3. In Netlify, create a new site from Git and connect your repo.
4. Set build command: `npm run build` and publish directory: `.next`
5. Add environment variables for Clerk and Firebase in Netlify dashboard.
6. Deploy! Your app will be live at your Netlify URL.

---

## 🏆 Usage

- Visit the deployed link or run locally.
- Solve crossword clues to beat the AI opponent.
- Use chat to interact or get hints.
- Watch live score and word highlights.
- Enjoy and compete!

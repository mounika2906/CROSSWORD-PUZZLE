#  Crossword puzzle game

## Live Demo

Check out the live version of the Crossword Battle Arena game here:  
[Live App](https://6898656e245eab9c8964638c--fastidious-capybara-374939.netlify.app/)


![image1.png](https://github.com/mounika2906/CROSSWORD-PUZZLE/blob/aa96b10346cedae44d6d776cd1fda3b50f9df663/cv%20.png)
![image.png](https://github.com/mounika2906/CROSSWORD-PUZZLE/blob/aa96b10346cedae44d6d776cd1fda3b50f9df663/cv%202.png)

A real-time, AI-powered, web-based crossword game where human players challenge an intelligent opponent that competes and chats simultaneously.

---

##  Objective

Traditional crossword games are usually single-player and lack real-time interaction. There is a need for an engaging, competitive crossword experience where users can play against an intelligent opponent.

This project aims to create a fun, interactive web-based crossword game where a human player can solve clues while competing with an AI that can also solve clues and respond with witty messages, making the experience more enjoyable and dynamic.

---

## ⚙ Approach & Key Features

-  **Frontend** built with `Next.js` (React Framework)
-  **Authentication** with `Clerk`
-  **Real-time sync** using `Firebase Realtime Database` for:
  - Game state
  - Chat messages
  - Score updates
-  **AI Opponent** using `GroqCloud LLM API`:
  - Competes in solving clues
  - Sends smart, witty responses in chat
-  **UI/UX** built using `React components` and `Tailwind CSS`
  - Conditionally styled grid cells based on player/AI progress

---

##  Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend/Realtime**: Firebase Realtime Database  
- **Auth**: Clerk  
- **AI**: GroqCloud API (OpenAI-compatible)  
- **Chat/Logic**: uuid, axios, React Hooks

---

##  Business Impact

This solution demonstrates:

- Real-time multiplayer logic  
- AI-assisted interaction  
- Intelligent, LLM-based chat  

These can be adapted into Xangam’s AI and computer vision products. The Firebase + AI architecture can power:

- Collaborative platforms  
- Gamified learning tools  
- EdTech and language-learning games  
- OCR/Computer Vision-based puzzle integration

---

##  Future Scope

This project has the potential to evolve into a full-fledged interactive learning or gaming application. Possible extensions:

-  **AI-generated crossword puzzles**
-  **Multiplayer mode**
-  **Leaderboard and ranking system**
-  **OCR integration** to scan and digitize paper crosswords
-  **Adaptive puzzles** for vocabulary or subject-based learning
-  **Language learning** or quiz-based apps for edtech markets

---

##  Folder Structure 
/app
/game
page.tsx // Main game logic
/chat
component.tsx // Real-time chat UI
/firebase
/utils
aiLogic.ts // Groq LLM logic
firebase.ts // Firebase config


## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Deployment on Netlify
The game is deployed on Netlify for easy online access.

Steps to Deploy on Netlify

Build the app

npm run build

Create a Netlify account at [netlify](https://netlify.com) if you don’t have one.

In Netlify dashboard, click New site from Git and connect your GitHub repository.

Configure the build settings:

### Build command: npm run build

### Publish directory: .next

Add Firebase environment variables in Netlify dashboard:


Deploy the site. After build completes, your live game will be available at a Netlify-generated URL.

## Usage

Visit the deployed link or run locally.

Solve crossword clues to beat the AI opponent.

Use chat to interact or get hints.

Watch live score and word highlights.

Enjoy and compete!

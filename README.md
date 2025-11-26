# 🏯 Pokémon Battle Tower Roguelike

<p align="center">
  <img src="https://img.shields.io/badge/Pok%C3%A9API-powered-red?style=flat-square&logo=pokemon" alt="PokéAPI Badge" />
  <img src="https://img.shields.io/badge/frontend-react-blue?style=flat-square&logo=react" alt="React Badge" />
  <img src="https://img.shields.io/badge/state-recoil-purple?style=flat-square&logo=recoil" alt="Recoil Badge" />
  <img src="https://img.shields.io/badge/storage-localStorage-orange?style=flat-square" alt="localStorage Badge" />
  <img src="https://img.shields.io/badge/deployment-localhost-lightgrey?style=flat-square" alt="Localhost Badge" />
</p>

A client-side roguelike Pokémon game where players climb a battle tower, build a powerful team, and try to reach the highest floor before being knocked out!
Inspired by classic Pokémon mechanics and powered by modern web tech. All game data is stored locally in your browser.

---

## ⚔️ Gameplay Concept

- 🎲 Start with 1 random Pokémon.
- 🧗 Climb the tower: each floor features increasingly strong trainers.
- 🏅 Win battles to earn rewards:
  - 🧬 Catch new Pokémon
  - 🩹 Heal your team
  - 💪 Buff stats
- ☠️ Lose all your Pokémon = Game over!
- 🏆 Track your runs and compare your best performances.

---

## 🛠️ Tech Stack

| Layer      | Tech                           |
| ---------- | ------------------------------ |
| Frontend   | React + Recoil                 |
| Animations | Framer Motion                  |
| Storage    | Browser localStorage           |
| API        | [PokéAPI](https://pokeapi.co/) |
| Build Tool | Vite                           |

---

## 📁 Project Structure

    pokemon-battle-tower/
    └── client/         # Frontend (Vite + React + Recoil)
        └── src/
            ├── components/
            ├── pages/
            ├── recoil/
            ├── services/
            ├── utils/
            ├── App.jsx
            └── main.jsx

---

## 🚀 Getting Started

### 🧩 Prerequisites

- [Node.js](https://nodejs.org/)
- A modern web browser with localStorage support

### 🚀 Setup & Run

1. Clone the repository
2. Install dependencies and start the dev server:

```bash
cd client
npm install
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:5173/
```

### 💾 Data Storage

All game data is stored locally in your browser using localStorage:
- **Save Slots**: 3 manual save slots + 1 autosave
- **Meta Progression**: Achievements, unlocked starters, permanent gold, relic collection
- **Player Progression**: XP, levels, talent trees, trainer skills
- **Run Statistics**: Personal leaderboard and run history

Note: Clearing browser data will erase your progress. Use the in-game export feature to backup saves.

---

## ✨ Current Features

- 🎲 Roguelike progression through randomized tower floors
- ⚔️ Turn-based Pokémon battles with type effectiveness
- 🧬 Evolution system with level-based evolutions
- 🎭 Random event encounters (shops, trainers, choices)
- 🏆 Meta-progression with achievements and unlockable starters
- 🌳 Talent tree system with multiple branches
- 🔮 Relic system with powerful passive effects
- 📊 Personal run statistics and leaderboard
- 💾 Multiple save slots with import/export functionality
- 🎨 Polished UI with animations and visual effects

---

## 👤 Author

> Developed by [**Valentin "Vraith" Gillot**](https://github.com/Jackmaa)  
> Full-stack developer, creative lead & Pokémon fan since forever 🔥

---

## 💖 Acknowledgements

- [PokéAPI](https://pokeapi.co/)
- Pokémon™ & GameFreak/Nintendo
- Inspired by classic Pokémon Battle Tower and Emerald Battle Frontier

---

## 📷 Screenshots

> _(Add game screen previews or demo GIFs here soon!)_


## 🧪 Want to Playtest?

Clone the repo, run the frontend & backend, and start climbing!  
Feedback, pull requests, and contributions welcome 🎮

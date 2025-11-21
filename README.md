# 🏯 Pokémon Battle Tower Roguelike

<p align="center">
  <img src="https://img.shields.io/badge/Pok%C3%A9API-powered-red?style=flat-square&logo=pokemon" alt="PokéAPI Badge" />
  <img src="https://img.shields.io/badge/frontend-react-blue?style=flat-square&logo=react" alt="React Badge" />
  <img src="https://img.shields.io/badge/state-recoil-purple?style=flat-square&logo=recoil" alt="Recoil Badge" />
  <img src="https://img.shields.io/badge/backend-express-black?style=flat-square&logo=express" alt="Express Badge" />
  <img src="https://img.shields.io/badge/database-mongodb-brightgreen?style=flat-square&logo=mongodb" alt="MongoDB Badge" />
  <img src="https://img.shields.io/badge/deployment-localhost-lightgrey?style=flat-square" alt="Localhost Badge" />
</p>

A full-stack roguelike Pokémon game where players climb a battle tower, build a powerful team, and try to reach the highest floor before being knocked out!  
Inspired by classic Pokémon mechanics and powered by modern web tech.

---

## ⚔️ Gameplay Concept

- 🎲 Start with 1 random Pokémon.
- 🧗 Climb the tower: each floor features increasingly strong trainers.
- 🏅 Win battles to earn rewards:
  - 🧬 Catch new Pokémon
  - 🩹 Heal your team
  - 💪 Buff stats
- ☠️ Lose all your Pokémon = Game over!
- 🏆 Save your score and climb the leaderboard.

---

## 🛠️ Tech Stack

| Layer      | Tech                           |
| ---------- | ------------------------------ |
| Frontend   | React + Recoil (or Redux)      |
| Animations | Framer Motion                  |
| Backend    | Node.js + Express              |
| Database   | MongoDB                        |
| API        | [PokéAPI](https://pokeapi.co/) |
| Tools      | Postman, MongoDB Compass       |

---

## 📁 Project Structure

    pokemon-battle-tower/
    ├── client/         # Frontend (Vite + React + Recoil)
    │   └── src/
    │       ├── components/
    │       ├── pages/
    │       ├── recoil/
    │       ├── services/
    │       ├── App.jsx
    │       └── main.jsx
    ├── server/         # Backend (Node + Express)
    │   ├── models/
    │   ├── routes/
    │   ├── server.js
    │   └── .env

---

## 🚀 Getting Started

### 🧩 Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [PokéAPI](https://pokeapi.co/) – no API key required

---

### ⚙️ Backend Setup

Run the following in your terminal:

    cd server
    npm install
    echo "MONGO_URI=mongodb://localhost:27017/battletower" > .env
    node server.js

---

### 🧪 Test the API

Make sure your backend is running, then test:

    curl http://localhost:5000/test

---

### 💻 Frontend Setup

In another terminal window:

    cd client
    npm install
    npm run dev

The app will be available at:

    http://localhost:5173/

---

## 📡 API Endpoints

### `POST /api/runs`

Saves a new run to the database.  
Example payload:

    {
      "username": "Vraith",
      "team": [
        {
          "name": "Charizard",
          "level": 42,
          "isShiny": false,
          "stats": {
            "hp": 120,
            "attack": 80,
            "defense": 70,
            "speed": 100,
            "special_attack": 95,
            "special_defense": 85
          }
        }
      ],
      "floorReached": 12,
      "rewardsChosen": ["Heal", "Catch New"]
    }

---

### `GET /api/runs`

Returns all saved runs (sorted by latest first).

---

## 🎯 Features To Come

- 🧠 Smarter AI for enemy trainers
- 🧬 Pokémon evolution mechanics
- 🏆 Global leaderboard & Hall of Fame
- 🎭 Randomized event floors
- 🛒 Shop / item system
- 👤 Player login & profile system

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

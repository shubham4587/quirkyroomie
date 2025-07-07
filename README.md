# 🏡 QuirkyRoomie – Flatmate Complaint System

A full-stack MERN application that allows flatmates to report and resolve household complaints. Built for a machine test.

## 🔧 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT
- **Deployment**: Coming soon (Vercel + Render)

## ✨ Features

-  User Registration & Login (JWT Auth)
-  Submit complaints (with type + severity)
- 👍 Upvote / 👎 Downvote complaints
-  Mark complaints as resolved
-  Karma points system
-  Punishment generator (on 10 upvotes)
-  Leaderboard (top karma users)
-  Stats dashboard (offenders, categories)

## 🛠️ How to Run Locally

```bash
# 1. Clone repo
git clone https://github.com/yourname/quirkyroomie.git
cd quirkyroomie

# 2. Setup backend
cd quirkyroomie-server
npm install
npm run dev

# 3. Setup frontend
cd quirkyroomie-client
npm install
npm run dev

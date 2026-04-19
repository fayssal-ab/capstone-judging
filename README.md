# Capstone Judging App

<p align="center">
  <img src="Al_Akhawayn_University_Logo.png" alt="Al Akhawayn University" width="200"/>
</p>

<p align="center">
  <strong>Al Akhawayn University — Capstone Final Competition 2026</strong><br/>
  Judging platform for evaluating capstone projects across 3 competition days.
</p>

---

## Overview

A full-stack web application that allows **judges** to evaluate capstone teams and **admins** to manage the competition. Built with **Flask** (backend) and **React** (frontend).

### Features

- JWT-based authentication (6 judges + 1 admin)
- 36 teams across 3 competition days (April 11, 12, 13)
- 7 scoring criteria (0–20 scale) with visual validation
- Circular countdown timer with 1-minute sound alert
- Report viewer (Google Drive links)
- Duplicate submission protection
- Judge progress tracker
- Search & filter by date
- Export rankings to Excel (3 sheets) or CSV
- Print-friendly ranking page
- Automatic tie-break logic
- Session expiry with auto-redirect
- Toast notifications & confirmation modals
- Fully responsive (mobile + desktop) with hamburger menu

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | [python.org/downloads](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MongoDB | Latest | [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |

---

## Quick Start (Build Mode — Single Server)

This method serves everything from Flask on **port 5000 only**. Ideal for running on a local network.

### 1. Start MongoDB

```bash
mongosh
```

If MongoDB isn't running:

```bash
net start MongoDB
```

### 2. Setup Backend

```bash
cd capstone-judging/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Seed the Database

```bash
python seed.py
python seed1.py
```

Expected output:

```
=== Seed done ===
Admin: admin@capstone.ma / ADMIN2026
Judges: judge1-6@capstone.ma / JUDGE01-06
Teams: 36 created
  April 11: 10 teams
  April 12: 16 teams
  April 13: 10 teams
```

### 4. Find Your IP

```bash
ipconfig
```

Look for the **Wi-Fi adapter → IPv4 Address** (e.g. `192.168.1.55`). Ignore VirtualBox or Ethernet IPs.

### 5. Set the API URL

Open `frontend/src/api/axios.js` and set:

```js
const API = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
});
```

> This makes the app work on any device automatically — no need to hardcode an IP.

### 6. Build the Frontend

```bash
cd capstone-judging/frontend
npm install
npm run build
```

Then copy the `build/` folder into the backend:

```bash
xcopy /E /I .\build ..\backend\build
```

### 7. Run the App

```bash
cd capstone-judging/backend
venv\Scripts\activate
python app.py
```

### 8. Open the App

| Device | URL |
|--------|-----|
| Your PC | `http://localhost:5000` |
| Other devices (same Wi-Fi) | `http://YOUR_IP:5000` |

---

## Quick Start (Dev Mode — Two Servers)

For development with hot-reload.

**Terminal 1 — Backend:**

```bash
cd capstone-judging/backend
venv\Scripts\activate
python app.py
```

**Terminal 2 — Frontend:**

```bash
cd capstone-judging/frontend
set HOST=0.0.0.0
npm start
```

- Local: `http://localhost:3000`
- Network: `http://YOUR_IP:3000`

---

## Default Accounts

| Role | Email | Code |
|------|-------|------|
| Admin | admin@capstone.ma | ADMIN2026 |
| Judge 1 | judge1@capstone.ma | JUDGE01 |
| Judge 2 | judge2@capstone.ma | JUDGE02 |
| Judge 3 | judge3@capstone.ma | JUDGE03 |
| Judge 4 | judge4@capstone.ma | JUDGE04 |
| Judge 5 | judge5@capstone.ma | JUDGE05 |
| Judge 6 | judge6@capstone.ma | JUDGE06 |

---

## Firewall (Network Access)

If other devices can't connect, open port 5000 in Windows Firewall.

**PowerShell (Admin):**

```powershell
netsh advfirewall firewall add rule name=Flask5000 dir=in action=allow protocol=TCP localport=5000
```

Or manually: **Windows Settings → Windows Security → Firewall → Turn off for Private network.**

---

## Project Structure

```
capstone-judging/
├── backend/
│   ├── app.py                    # Flask app + serves React build
│   ├── seed.py                   # Database seeder
│   ├── requirements.txt
│   ├── models/
│   │   ├── database.py           # MongoDB connection
│   │   ├── user.py               # User model (Admin + Judge)
│   │   ├── team.py               # Team CRUD
│   │   └── score.py              # Score + criteria
│   ├── routes/
│   │   ├── auth.py               # Login + judge list
│   │   ├── teams.py              # Team CRUD endpoints
│   │   ├── scores.py             # Submit + read scores
│   │   ├── ranking.py            # Rankings + tie-break
│   │   └── dashboard.py          # Admin stats
│   ├── middleware/
│   │   └── auth_middleware.py    # JWT + role guard
│   └── utils/
│       └── tiebreak.py           # Tie-break logic
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.js          # API client + interceptors
│       ├── context/
│       │   └── AuthContext.jsx    # Auth state
│       ├── components/
│       │   ├── Navbar.jsx         # Responsive nav
│       │   ├── ProtectedRoute.jsx # Role-based route guard
│       │   ├── ScoreForm.jsx      # 7 criteria form
│       │   ├── TeamCard.jsx       # Team card + status
│       │   ├── CountdownTimer.jsx # Circular timer + alerts
│       │   ├── ReportViewer.jsx   # Report link viewer
│       │   ├── Modal.jsx          # Confirmation modal
│       │   ├── Toast.jsx          # Notifications
│       │   └── JudgeProgress.jsx  # Progress bar
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── judge/
│       │   │   ├── Agenda.jsx     # Teams list + date filter
│       │   │   ├── TeamEval.jsx   # Timer + report + scoring
│       │   │   └── MyScores.jsx   # Score history
│       │   └── admin/
│       │       ├── Dashboard.jsx  # Stats + missing evals
│       │       ├── Ranking.jsx    # Rankings + export
│       │       ├── ManageTeams.jsx# Team CRUD + search
│       │       └── ManageJudges.jsx# Jury list
│       └── App.jsx                # Routes
│
└── run_app.bat                    # Quick launcher
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Flask, Flask-JWT-Extended, Flask-CORS |
| Database | MongoDB + PyMongo |
| Frontend | React, Tailwind CSS, Lucide Icons |
| Auth | JWT (JSON Web Tokens) |
| Export | SheetJS (xlsx), FileSaver |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `404` on `localhost:5000` | Build folder missing — run `npm run build` and copy to `backend/` |
| Other devices can't connect | Open port 5000 in firewall or disable firewall for private network |
| API errors from other devices | Make sure `axios.js` uses `window.location.hostname` not `localhost` |
| MongoDB not running | Run `net start MongoDB` |
| Wrong IP | Run `ipconfig` — use the Wi-Fi adapter IP, not VirtualBox |

---

## License

This project was built for Al Akhawayn University's Capstone Final Competition 2026.

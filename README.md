## Guide Complet — Capstone Judging App

---

### Prérequis

- **Python 3.10+** → [python.org/downloads](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **MongoDB** → [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

---

### requirements.txt

```
bcrypt==5.0.0
blinker==1.9.0
click==8.3.2
colorama==0.4.6
dnspython==2.8.0
Flask==3.1.3
flask-cors==6.0.2
Flask-JWT-Extended==4.7.1
itsdangerous==2.2.0
Jinja2==3.1.6
MarkupSafe==3.0.3
marshmallow==4.3.0
PyJWT==2.12.1
pymongo==4.16.0
python-dotenv==1.2.2
Werkzeug==3.1.8
```

Msa7t `Flask-PyMongo` hit ma-kaynستعملوهش, kaynستعملو `pymongo` directement.

---

### Etape 1 — MongoDB

Installi MongoDB, assuri kaykhdem:

```powershell
mongosh
```

Ila ma khdmch:

```powershell
net start MongoDB
```

---

### Etape 2 — Backend

```powershell
cd capstone-judging\backend
python -m venv venv
venv\Scripts\activate
pip install -r ..\requirements.txt
```

---

### Etape 3 — Seed

```powershell
python seed.py
```

Khass yban:

```
=== Seed done ===
Admin: admin@capstone.ma / ADMIN2026
Judges: judge1-6@capstone.ma / JUDGE01-06
Teams: 36 created
  April 11: 10 teams
  April 12: 16 teams
  April 13: 10 teams
```

---

### Etape 4 — Changer l'IP

```powershell
ipconfig
```

Chof **IPv4 Address** (mثلا `192.168.1.55`).

Ouvri `frontend/src/api/axios.js`, bdl:

```javascript
baseURL: "http://TON_IP_ICI:5000/api",
```

---

### Etape 5 — Frontend

```powershell
cd capstone-judging\frontend
npm install
npm install axios react-router-dom@6 lucide-react xlsx file-saver
npm install -D tailwindcss@3 postcss autoprefixer
```

---

### Etape 6 — Lancer

**Terminal 1 — Backend:**

```powershell
cd backend
venv\Scripts\activate
python app.py
```

**Terminal 2 — Frontend:**

```powershell
cd frontend
npm start
```

---

### Etape 7 — Ouvrir l'app

- **Local**: `http://localhost:3000`
- **Téléphone / autre PC** (même WiFi): `http://TON_IP:3000`

---

### Comptes

| Role | Email | Code |
|---|---|---|
| Admin | admin@capstone.ma | ADMIN2026 |
| Judge 1 | judge1@capstone.ma | JUDGE01 |
| Judge 2 | judge2@capstone.ma | JUDGE02 |
| Judge 3 | judge3@capstone.ma | JUDGE03 |
| Judge 4 | judge4@capstone.ma | JUDGE04 |
| Judge 5 | judge5@capstone.ma | JUDGE05 |
| Judge 6 | judge6@capstone.ma | JUDGE06 |

---

### Architecture Backend

```
backend/
├── app.py                    ← Flask + MongoDB connection
├── seed.py                   ← Script pour remplir la base
├── models/
│   ├── database.py           ← MongoDB connection singleton
│   ├── user.py               ← User (Admin + Judge)
│   ├── team.py               ← Team CRUD
│   └── score.py              ← Score + criteria
├── routes/
│   ├── auth.py               ← Login + list judges
│   ├── teams.py              ← CRUD teams
│   ├── scores.py             ← Submit + read scores
│   ├── ranking.py            ← Classement + tie-break
│   └── dashboard.py          ← Stats admin
├── middleware/
│   └── auth_middleware.py    ← JWT + role guard
└── utils/
    └── tiebreak.py           ← Tie-break logic
```

### Architecture Frontend

```
frontend/src/
├── api/
│   └── axios.js              ← API config + interceptors
├── context/
│   └── AuthContext.jsx        ← Auth state management
├── components/
│   ├── Navbar.jsx             ← Responsive nav + hamburger
│   ├── ProtectedRoute.jsx     ← Route guard par role
│   ├── ScoreForm.jsx          ← 7 criteria + validation
│   ├── TeamCard.jsx           ← Card team + status
│   ├── CountdownTimer.jsx     ← Circular clock + alerts
│   ├── ReportViewer.jsx       ← Report link viewer
│   ├── Modal.jsx              ← Confirmation modal
│   ├── Toast.jsx              ← Notifications
│   └── JudgeProgress.jsx      ← Progress bar judge
├── pages/
│   ├── Login.jsx
│   ├── judge/
│   │   ├── Agenda.jsx         ← Teams list + filter par date
│   │   ├── TeamEval.jsx       ← Timer + report + score form
│   │   └── MyScores.jsx       ← Historique scores
│   └── admin/
│       ├── Dashboard.jsx      ← Stats + missing evaluations
│       ├── Ranking.jsx        ← Classement + export Excel/CSV
│       ├── ManageTeams.jsx    ← CRUD + search + filter
│       └── ManageJudges.jsx   ← Liste jury
├── assets/
│   └── logo/
│       └── logo.png           ← Logo Al Akhawayn
└── App.jsx                    ← Routes
```

---

### Fichiers importants à vérifier

| Fichier | Chnou tchecki |
|---|---|
| `frontend/src/api/axios.js` | IP dyalk f baseURL |
| `frontend/tailwind.config.js` | Content path mzyan |
| `frontend/src/index.css` | Tailwind imports + fonts |
| `frontend/package.json` | `"start": "set HOST=0.0.0.0&&react-scripts start"` |
| `backend/app.py` | `host="0.0.0.0"` f `app.run()` |
| `backend/models/database.py` | MongoDB URI |

---

### Si Firewall bloque

Windows → Settings → Windows Security → Firewall → Turn off for Private network.

---

### Features dyal l'app

- Login b code (JWT)
- 6 juges + 1 admin
- 36 teams sur 3 jours
- 7 critères de notation (0-20)
- Circular countdown timer + sound alert (1 min)
- Report viewer (Google Drive link)
- Duplicate submission protection
- Score validation visuelle (color coding)
- Confirmation modal
- Toast notifications
- Session expiry auto-redirect
- Judge progress tracker
- Search + filter par date
- Export Excel (3 sheets) + CSV
- Print-friendly ranking
- Tie-break automatique
- Responsive (mobile + desktop)
- Hamburger menu mobile
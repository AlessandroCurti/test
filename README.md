# CVE Webapp ChatGPT

Web app React + Node.js per cercare vulnerabilità CVE tramite CIRCL API e generare remediation plan usando OpenAI GPT-4.

## 🛠️ Setup locale

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Aggiungi la tua chiave API OpenAI a .env
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌍 Deploy gratuito

### Backend su Render
- Build command: `npm install`
- Start command: `npm start`
- Env var: `OPENAI_API_KEY`

### Frontend su Vercel
- Modifica gli URL in `App.jsx` per usare quello del backend Render
- Deploy automatico da GitHub

---

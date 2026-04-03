# 🐾 PawFix AI – Instant Dog Problem Solver

A mobile-first web app that helps dog owners instantly solve daily problems using AI.

## Features

- **Food Safety Checker** — Is this food safe for my dog?
- **Emergency Help** — Immediate steps for common dog emergencies
- **Behavior Analyzer** — Understand why your dog acts a certain way
- **Daily Feeding Guide** — Personalized feeding recommendations
- **Recommended Treats** — Curated product suggestions (future ecommerce)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** OpenAI API (GPT-4o-mini) with built-in fallback
- **Database:** SQLite via better-sqlite3
- **Language:** TypeScript

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### 1. Clone / navigate to the project

```bash
cd pawfix-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

> **No API key?** The app works without one! It uses built-in fallback responses for all features. You can add the key later for full AI-powered answers.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or phone).

---

## 📁 Project Structure

```
pawfix-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ask/
│   │   │       └── route.ts          # POST /api/ask — main AI endpoint
│   │   ├── globals.css                # Tailwind + custom styles
│   │   ├── layout.tsx                 # Root layout (metadata, viewport)
│   │   └── page.tsx                   # Home page (main UI)
│   ├── components/
│   │   ├── SearchBox.tsx              # Search input with submit button
│   │   ├── FeatureCard.tsx            # Action button cards
│   │   ├── ResultCard.tsx             # AI response display
│   │   ├── TreatCard.tsx              # Recommended treat (ecommerce placeholder)
│   │   ├── QuickChip.tsx              # Quick suggestion pills
│   │   ├── LoadingState.tsx           # Loading spinner
│   │   └── ErrorMessage.tsx           # Error display
│   └── lib/
│       ├── ai.ts                      # AI logic: prompts, OpenAI call, fallbacks
│       ├── db.ts                      # SQLite database setup + queries
│       └── utils.ts                   # cn() classname utility
├── .env.example                       # Environment variable template
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔑 Where to Add API Keys

Edit `.env.local` in the project root:

| Variable | Description | Required? |
|---|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key | Optional (fallback included) |
| `OPENAI_MODEL` | Model to use (default: `gpt-4o-mini`) | Optional |

Get your API key at: https://platform.openai.com/api-keys

---

## 🧠 How the AI Works

The `getDogAdvice(promptType, userInput)` function in `src/lib/ai.ts`:

1. Selects a specialized system prompt based on the feature type
2. Calls OpenAI API (if key is configured)
3. Parses the structured JSON response
4. Falls back to built-in responses if API is unavailable

Response format:
```json
{
  "status": "Safe | Unsafe | Limited | Urgent | Monitor | Normal | ...",
  "explanation": "Brief explanation",
  "actions": ["Step 1", "Step 2", "Step 3"]
}
```

---

## 🗄 Database

SQLite database (`pawfix.db`) is auto-created on first request. Tables:

- **queries** — Logs every question and AI response
- **food_database** — Optional pre-filled food safety data

---

## 📱 Mobile-First Design

- Viewport locked for native-like feel
- Touch-friendly buttons (min 44px targets)
- Safe area padding for notched devices
- Soft, neutral color palette (white, beige, green)
- Responsive max-width container (max-w-lg)

---

## Production Deployment

```bash
npm run build
npm start
```

Deploys easily to **Vercel** (recommended), Railway, or any Node.js host.

> **Note:** For Vercel deployment, swap `better-sqlite3` for a hosted database (e.g., Vercel Postgres, Turso, PlanetScale) since Vercel serverless functions don't support persistent SQLite.

---

## License

MIT

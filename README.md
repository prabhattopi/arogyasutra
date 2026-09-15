# ArogyaSutra 🏥
> **Privacy-First, On-Premise Medical Report Companion**  
> *Translates complex diagnostic lab reports into clear, empathetic, everyday language so patients and families can truly understand their health and act early — with 100% on-device air-gapped privacy.*

[![Hackathon](https://img.shields.io/badge/Hackathon-Hack2Heal%202.0-orange?style=for-the-badge&logo=shield)](https://startupgrantsindia.com/competitions/hack2heal-20-global-healthcare-innovation-hackathon)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4_Vite-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Ollama](https://img.shields.io/badge/Local_AI-Ollama-white?style=for-the-badge&logo=ollama)](https://ollama.ai/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local_Docker-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

---

## 🌟 Submission Overview

- **Project Title:** ArogyaSutra
- **Hackathon:** Hack2Heal 2.0 - Global Healthcare Innovation Hackathon (Organized by IEM)
- **Elevator Pitch:** Translates complex lab reports into simple, everyday language so patients and families can truly understand their health and act early.
- **Repository:** [https://github.com/prabhattopi/arogyasutra](https://github.com/prabhattopi/arogyasutra)
- **Tags:** `react`, `node.js`, `express.js`, `mongodb`, `ollama`, `local-llm`, `javascript`, `tailwind-css`, `ai`, `machine-learning`, `healthcare`, `typescript`.

---

## 💡 Inspiration & The Clinical Challenge

Every time a family receives a diagnostic blood panel or discharge summary, the same anxious cycle unfolds:
1. **Deciphering Incomprehensible Jargon:** Confronting clinical terms like *"elevated alkaline phosphatase,"* *"toxic granulation in neutrophils,"* or *"microcytic hypochromasia."*
2. **Panic-Inducing Web Searches:** Frantic web searching predicts worst-case diagnoses, amplifying distress.
3. **Severe Privacy Risks:** Uploading sensitive Protected Health Information (PHI) to cloud AI models creates corporate logging and identity leakage vulnerabilities.

**ArogyaSutra** solves this challenge: a **100% air-gapped, on-premise medical report companion** running entirely on-device via quantized local models in **Ollama** and a **local Docker MongoDB database** — zero cloud data uploads, zero third-party logging, and zero data leakage.

---

## 🏗️ Visual Architecture & Data Flow

```mermaid
flowchart LR
    classDef input fill:#1e1b2e,stroke:#f59e0b,stroke-width:2px,color:#fef3c7;
    classDef backend fill:#111827,stroke:#f97316,stroke-width:2px,color:#fed7aa;
    classDef ai fill:#1a1025,stroke:#ec4899,stroke-width:2px,color:#fbcfe8;
    classDef db fill:#062319,stroke:#10b981,stroke-width:2px,color:#a7f3d0;
    classDef ui fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#e0f2fe;

    subgraph STEP1 ["1. Document Ingestion"]
        PDF["📄 Diagnostic Report<br/>(PDF / TXT / 1-Click Preset)"]:::input
    end

    subgraph STEP2 ["2. Backend Orchestrator (Node.js + TS)"]
        Extractor["🔬 Biomarker Extractor<br/>(Normalizes 30+ Parameters)"]:::backend
        Guardrails["🛡️ Clinical Guardrails<br/>(Non-Diagnostic Safe Prompt)"]:::backend
        SSE["⚡ Real-Time SSE Stream<br/>(Server-Sent Events)"]:::backend
    end

    subgraph STEP3 ["3. Air-Gapped AI (Docker)"]
        Ollama["🧠 Local Ollama Container<br/>(Quantized llama3.2:1b)"]:::ai
    end

    subgraph STEP4 ["4. Local Storage (Docker)"]
        Mongo["🍃 Local MongoDB 7.0<br/>(Air-Gapped Longitudinal Data)"]:::db
    end

    subgraph STEP5 ["5. Luxury Frontend (React 19 + Tailwind v4)"]
        Gauges["📊 Visual Range Gauges<br/>(Low / Normal / High / Critical)"]:::ui
        Explanation["📝 Plain-Language Summary<br/>(Readable Typographic Cards)"]:::ui
        Questions["🩺 Doctor Consultation Prep<br/>(Interactive Checklist)"]:::ui
        Trends["📈 Multi-Visit Trajectory<br/>(Interactive Recharts)"]:::ui
    end

    PDF -->|Raw Document| Extractor
    Extractor -->|Structured Parameters| Guardrails
    Guardrails -->|Prompt Request| Ollama
    Ollama -->|Token Stream| SSE
    SSE -->|Live Tokens| Explanation
    Extractor -->|Biomarker Metrics| Gauges
    Guardrails -->|Tailored Questions| Questions
    Extractor -->|Persist Visit| Mongo
    Mongo -->|Historical Trends| Trends
```

---

## ⚡ Key Pipeline Stages

| Stage | Icon | Component | What Happens |
| :--- | :---: | :--- | :--- |
| **Ingestion** | 📄 | Drag-and-Drop / 1-Click | Ingests CBC, Metabolic, or Lipid reports (PDF, text, or sample buttons). |
| **Extraction** | 🔬 | Normalization Engine | Extracts 30+ biomarkers (Hb, WBC, Glucose, HbA1c, Creatinine, etc.) and reference intervals. |
| **Safety Guardrails** | 🛡️ | Ethical Prompt Framework | Enforces strict non-diagnostic, non-prescriptive, empathetic guidance. |
| **Local Inference** | 🧠 | Dockerized Ollama (`llama3.2:1b`) | Quantized on-device LLM processes tokens with 0 bytes leaving your machine. |
| **Live Streaming** | ⚡ | Server-Sent Events (SSE) | Words stream smoothly into the UI in real time with zero latency lag. |
| **Air-Gapped Storage** | 🍃 | Local Docker MongoDB (`mongo:7.0`) | Anonymized longitudinal parameters are stored locally on your device. |
| **Presentation** | 🎨 | React 19 + Sunset Orange Theme | Visual range gauges, plain-language cards, consultation checklists, and Recharts. |

---

## 🚀 Quick Start (Automated Bash Script)

Our intelligent Git Bash script handles Docker container creation, local MongoDB setup, model auto-resolution, and launching everything in one command:

```bash
# Open Git Bash in arogyasutra/
bash ./run.sh
```

**How the script intelligently operates:**
1. **Scoped Safe Cleanup:** Only recreates `arogyasutra` project containers without touching your other containers (e.g. Postgres).
2. **Local MongoDB & Ollama:** Starts both local `arogyasutra-mongodb` (Mongo 7.0) and `arogyasutra-ollama` containers.
3. **Auto-Detects Models:** If a model is already installed in your Ollama container, it picks it immediately. If not, it pulls the fast, ultra-smart `llama3.2:1b`.
4. **Launches Fullstack App:** Automatically starts backend (`localhost:5000`) and frontend (`localhost:5173`).

### Pass a Custom Model (Optional)
```bash
# If your machine has high hardware specs:
bash ./run.sh llama3.2:3b
bash ./run.sh qwen2.5:1.5b
bash ./run.sh mistral
```

---

## 🛠️ Manual Local Development (Outside Docker)

```bash
# 1. Install dependencies
npm run install:all

# 2. Start local stack concurrently
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Diagnostics:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌐 Extensible Multilingual Support (i18n)

ArogyaSutra includes a modular key-based JSON dictionary in [`src/i18n/translations.ts`](client/src/i18n/translations.ts).
- Toggle between **English** and **हिंदी** directly from the top navigation bar.
- The entire interface (titles, sample presets, metric tables, status pills, consultation cards) updates instantly.
- New vernacular languages (Bengali, Tamil, Marathi) can be added simply by defining their translation keys in the dictionary.

---

## 🧪 Built-In Test Sample Reports

Located in [`sample-reports/`](sample-reports/) and loadable from the dashboard with 1 click:

| Sample Report | Scenario | Highlights |
| :--- | :--- | :--- |
| **`cbc_blood_report.txt`** | Microcytic Anemia & Infection | Hemoglobin 9.4 (Low), RBC 3.35 (Low), WBC 13,800 (High) |
| **`metabolic_panel.txt`** | Diabetes & Renal Stress | Glucose 168 (High), HbA1c 8.2% (High), Creatinine 1.45 (High) |
| **`lipid_cardiac_panel.txt`**| High Cholesterol & Inflammation | Total Cholesterol 252 (High), LDL 172 (High), hs-CRP 3.8 (High) |

---

## 🎬 3-Minute Hackathon Video Blueprint

Follow the second-by-second presentation walkthrough in [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for recording your Hack2Heal 2.0 submission video.

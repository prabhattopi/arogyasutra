# ArogyaSutra 🏥
> **100% Air-Gapped, Privacy-First Medical Report Translation & Clinical Companion**  
> *Translates complex diagnostic lab panels into clear, empathetic, everyday language using intuitive layman analogies so patients and families can truly understand their health and act early — with zero cloud data uploads, zero third-party logging, and zero PHI leakage.*

[![Hackathon](https://img.shields.io/badge/Hackathon-Hack2Heal%202.0-0d9488?style=for-the-badge&logo=shield)](https://startupgrantsindia.com/competitions/hack2heal-20-global-healthcare-innovation-hackathon)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4_Vite-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Ollama](https://img.shields.io/badge/Local_AI-Ollama-white?style=for-the-badge&logo=ollama)](https://ollama.ai/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local_Docker-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

---

## 🌟 Submission Overview

- **Project Title:** ArogyaSutra (आरोग्यसूत्र) v2.0
- **Hackathon:** Hack2Heal 2.0 — Global Healthcare Innovation Hackathon (Organized by IEM)
- **Elevator Pitch:** An air-gapped on-device clinical companion that turns intimidating laboratory panels into reassuring, plain-language insights and doctor consultation questions without exposing private health data to the cloud.
- **Repository:** [https://github.com/prabhattopi/arogyasutra](https://github.com/prabhattopi/arogyasutra)
- **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Node.js, Express, Local MongoDB 7.0, Local Ollama (`llama3.2:1b`), Docker Compose.

---

## 💡 Inspiration & The Clinical Challenge

Every time a family receives a diagnostic blood panel or discharge summary, the same anxious cycle unfolds:
1. **Deciphering Incomprehensible Jargon:** Confronting clinical terms like *"elevated alkaline phosphatase,"* *"toxic granulation in neutrophils,"* or *"microcytic hypochromasia."*
2. **Panic-Inducing Web Searches:** Frantic search engine queries predict worst-case diagnoses, amplifying emotional distress.
3. **Severe Privacy Risks:** Uploading sensitive Protected Health Information (PHI) to commercial cloud AI models creates corporate logging and biometric identity leakage risks.

**ArogyaSutra** solves this challenge with an **air-gapped, on-premise architecture**:
- **0 Bytes to Cloud:** PDF parsing, OCR text extraction, and quantized LLM inference run strictly within the local host.
- **Human-Friendly Layman Analogies:** Uses everyday concepts (oxygen delivery vehicles, immune defense soldiers, water filters) so non-experts have immediate clarity without anxiety.
- **Doctor Partnership:** Equips patients with prioritized, intelligent questions to discuss during physician consultations.

---

## 🏗️ Visual Architecture & Data Flow

```mermaid
flowchart LR
    classDef input fill:#080d18,stroke:#2dd4bf,stroke-width:2px,color:#f0fdfa;
    classDef backend fill:#0b1322,stroke:#14b8a6,stroke-width:2px,color:#ccfbf1;
    classDef ai fill:#052e2b,stroke:#10b981,stroke-width:2px,color:#a7f3d0;
    classDef db fill:#062319,stroke:#059669,stroke-width:2px,color:#6ee7b7;
    classDef ui fill:#090f1d,stroke:#38bdf8,stroke-width:2px,color:#e0f2fe;

    subgraph STEP1 ["1. Zero-Cloud Document Ingestion"]
        PDF["📄 Diagnostic Report<br/>(Slide-Over Drawer / PDF / TXT / 1-Click Preset)"]:::input
    end

    subgraph STEP2 ["2. Local Backend Orchestrator (Node.js + TS)"]
        Extractor["🔬 Biomarker Normalization<br/>(Parses 30+ Parameters & Ref Intervals)"]:::backend
        Guardrails["🛡️ Ethical Clinical Guardrails<br/>(Strict Non-Diagnostic & Empathetic Framing)"]:::backend
        SSE["⚡ Real-Time SSE Stream<br/>(Live Token Delivery)"]:::backend
    end

    subgraph STEP3 ["3. Air-Gapped Local LLM (Docker / Local)"]
        Ollama["🧠 Ollama Inference Engine<br/>(Quantized llama3.2:1b on-device)"]:::ai
    end

    subgraph STEP4 ["4. Local Database (Docker / Local)"]
        Mongo["🍃 Local MongoDB 7.0<br/>(On-Premises Historical Longitudinal Data)"]:::db
    end

    subgraph STEP5 ["5. Cyber-Clinical Frontend (React 19 + Tailwind v4)"]
        Summary["📄 Plain Summary<br/>(Dedicated Layman Reading View)"]:::ui
        Chat["💬 Copilot Chat<br/>(Multi-Turn Session Memory)"]:::ui
        Gauges["📊 Range Gauges<br/>(Visual Status & Abnormal Alerts)"]:::ui
        Questions["🩺 Doctor Checklist<br/>(Prioritized Consultation Cards)"]:::ui
        Trends["📈 Health Trends<br/>(Longitudinal Recharts)"]:::ui
        Split["⊞ Split View<br/>(Sticky Side-by-Side Comparison)"]:::ui
    end

    PDF -->|Raw Text / Buffer| Extractor
    Extractor -->|Extracted Biomarkers| Guardrails
    Guardrails -->|Prompt Request| Ollama
    Ollama -->|Token Stream| SSE
    SSE -->|Live Streaming| Summary
    SSE -->|Conversational Tokens| Chat
    Extractor -->|Biomarker Metrics| Gauges
    Guardrails -->|Tailored Questions| Questions
    Extractor -->|Persist Anonymized Parameters| Mongo
    Mongo -->|Historical Biomarkers| Trends
```

---

## 🚀 Key Features & Innovations

### 1. 🗂️ Slide-Over Side Drawer for Document Ingestion
- Ingestion controls (drag-and-drop file upload, raw clinical text paste, and 1-click verified test cases) are hosted in a sleek, glassmorphic **slide-over side drawer**.
- Maximizes 100% of vertical screen real estate for the active report, visual gauges, and conversational copilot.

### 2. 📑 6-Tab Unified Demystify Experience
Everything related to the active medical report is organized into 6 focused tabs:
1. **📄 Plain Summary (सरल सारांश):** Full-width, distraction-free reading of gentle reassurance, key findings explained in plain language, and actionable next steps. Includes 1-click copy and print/export.
2. **💬 AI Copilot Chat (AI साथी चैट):** Multi-turn conversational companion grounded in the active report. Supports dynamic suggested questions, collapsible question trays, and Hinglish understanding.
3. **📊 Biomarkers & Vitals:** Interactive visual range gauges with min/max healthy intervals and status pills (`LOW`, `NORMAL`, `HIGH`).
4. **🩺 Doctor Checklist:** High-priority, evidence-grounded questions tailored to flagged parameters to empower patient-physician dialogue.
5. **📈 Health Trends:** Multi-visit longitudinal charts (Recharts) tracking parameters across clinical checkups.
6. **⊞ Split View:** Side-by-side view with sticky summary cards pinned alongside the biomarker table without empty voids.

### 3. 🧠 Layman-Friendly Everyday Analogies
Complex pathology is automatically translated into concepts anyone can grasp:
- **Hemoglobin:** *"Oxygen delivery vehicle / delivery truck"* carrying fuel to muscles and tissues.
- **White Blood Cells (WBC):** *"Immune defense soldiers"* clearing temporary infection or inflammation.
- **Platelets:** *"Natural repair band-aids"* preventing bleeding and sealing micro-vessels.
- **Creatinine & eGFR:** *"Fine biological water filters"* processing waste from daily protein metabolism.
- **Cholesterol (LDL vs HDL):** *"Arterial delivery trucks vs street sweepers"* maintaining clean vascular walls.

### 4. 🔄 Multi-Turn Session Memory (Persistent Across Tabs & Languages)
- Switching between tabs (`Plain Summary` $\rightarrow$ `Biomarkers` $\rightarrow$ `Doctor Checklist` $\rightarrow$ `AI Copilot`) retains conversation history without wiping.
- Toggling between English and Hindi retains past chat history while directing subsequent responses in the chosen language.
- Chat session resets cleanly only when a brand-new report is uploaded or the browser is refreshed.

### 5. ⚠️ Interactive Range Alerts
- An intelligent warning badge (`⚠️ 9 Alerts Outside Range`) calculates out-of-range parameters.
- Clicking the badge instantly navigates to the biomarker table to highlight flagged indicators for immediate inspection.

### 6. 🌐 Multilingual Typography & Harmony (English & हिंदी)
- Fully localized key-based i18n dictionary ([`client/src/i18n/translations.ts`](client/src/i18n/translations.ts)).
- Optimized Devanagari typography using **Poppins** font with tailored line-height (`1.85`), zero negative letter-spacing, and aligned status badges for seamless reading rhythm.

---

## ⚡ Key Pipeline Stages

| Stage | Icon | Component | What Happens |
| :--- | :---: | :--- | :--- |
| **Ingestion** | 📄 | Slide-Over Side Drawer | Ingests CBC, Metabolic, or Lipid panels (PDF, text, or 1-click presets). |
| **Extraction** | 🔬 | Normalization Engine | Extracts 30+ biomarkers (Hb, WBC, Glucose, HbA1c, Creatinine, etc.) and reference intervals. |
| **Safety Guardrails** | 🛡️ | Ethical Prompt Framework | Enforces strict non-diagnostic, non-prescriptive, reassuring layperson guidance. |
| **Local Inference** | 🧠 | Ollama (`llama3.2:1b`) | Quantized on-device LLM processes tokens with zero bytes leaving the local machine. |
| **Live Streaming** | ⚡ | Server-Sent Events (SSE) | Tokens stream smoothly into the UI in real time with minimal latency. |
| **Air-Gapped Storage** | 🍃 | Local MongoDB (`mongo:7.0`) | Anonymized longitudinal parameters are stored locally on-device. |
| **Presentation** | 🎨 | React 19 + Cyber-Clinical Theme | Obsidian dark surfaces, visual range gauges, doctor consultation cards, and responsive drawers. |

---

## 🧪 Built-In Test Sample Reports

Test immediately with 1 click from the dashboard or drawer:

| Sample Report | Scenario | Highlights |
| :--- | :--- | :--- |
| **Complete Blood Count (CBC)** | Microcytic Anemia & Infection | Hemoglobin 9.4 (Low), RBC 3.35 (Low), WBC 13,800 (High), Neutrophils 78% (High) |
| **Comprehensive Metabolic Panel** | Diabetes & Renal Stress | Fasting Glucose 168 (High), HbA1c 8.2% (High), Creatinine 1.45 (High), eGFR 54 (Low) |
| **Cardiovascular & Lipid Panel** | High Cholesterol & Inflammation | Total Cholesterol 252 (High), LDL 172 (High), hs-CRP 3.8 (High), ApoB 132 (High) |

---

## 🚀 Running Locally (Fastest Development Mode)

Run the fullstack app directly on your local system without waiting for container rebuilds:

### Prerequisites
- Node.js 20+ and npm
- Local [Ollama](https://ollama.ai/) installed and running: `ollama run llama3.2:1b`

### 1. Start Backend API
```bash
cd server
npm install
npm run dev
```
*(Server starts on `http://localhost:5000` with hot-reload)*

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*(Client starts on `http://localhost:5173` with instant Vite HMR)*

### 3. Open in Browser
Navigate to [http://localhost:5173](http://localhost:5173) to evaluate ArogyaSutra.

---

## 🐳 Docker Deployment (100% Containerized)

Our automated runner script handles Docker container creation, local MongoDB setup, model auto-resolution, and launching everything:

```bash
# Open Git Bash in arogyasutra/
bash ./run.sh
```

**How the automated script operates:**
1. **Scoped Safe Cleanup:** Safely resets project containers without touching existing database containers.
2. **Local MongoDB & Ollama:** Spins up `arogyasutra-mongodb` (Mongo 7.0) and `arogyasutra-ollama`.
3. **Auto-Detects Models:** Uses existing local models or pulls quantized `llama3.2:1b`.
4. **Launches App:** Hosts backend at `localhost:5000` and frontend at `localhost:5173`.

---

## 🛡️ Clinical Guardrails & Disclaimers

> [!IMPORTANT]
> **Educational Tool Notice:** ArogyaSutra is strictly an educational companion designed to empower doctor-patient discussions. It does not provide medical diagnoses, clinical staging, or prescription medication advice. Always consult a licensed healthcare practitioner for clinical treatment decisions.

---

## 👥 Hackathon Team

- **Event:** Hack2Heal 2.0 Global Healthcare Innovation Hackathon
- **Track:** Patient Education, Vernacular Access & Air-Gapped Healthcare AI
- **Repository:** [https://github.com/prabhattopi/arogyasutra](https://github.com/prabhattopi/arogyasutra)

#!/usr/bin/env bash
# ==============================================================================
# ArogyaSutra - Air-Gapped Medical Report Companion (Hack2Heal 2.0 Hackathon)
# Automated Runner & Intelligent Local LLM Model Manager + Local Docker MongoDB
# ==============================================================================

set -e

# ANSI Color Codes
ORANGE='\033[0;33m'
AMBER='\033[1;33m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

PROJECT_NAME="arogyasutra"
DEFAULT_FALLBACK_MODEL="llama3.2:1b"
REQUESTED_MODEL="$1"

echo -e "${ORANGE}${BOLD}"
echo "======================================================================"
echo "    🏥 AROGYASUTRA — 100% Local Air-Gapped Medical Companion"
echo "    Local Ollama LLM + Local Docker MongoDB + React 19 Frontend"
echo "    Hack2Heal 2.0 Global Healthcare Innovation Hackathon"
echo "======================================================================"
echo -e "${NC}"

# 1. Verify Docker Availability
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker is not installed or not in PATH.${NC}"
    echo "Please launch Docker Desktop and try again."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}[ERROR] Docker daemon is not running.${NC}"
    echo "Please start Docker Desktop and ensure it is ready."
    exit 1
fi

echo -e "${GREEN}✔ Docker engine is active and ready.${NC}"

# 2. Project-Scoped Safe Cleanup
# Notice: ONLY containers belonging to 'arogyasutra' project will be recreated.
echo -e "${AMBER}ℹ Checking existing '${PROJECT_NAME}' project containers...${NC}"
EXISTING_CONTAINERS=$(docker ps -a --filter "label=com.docker.compose.project=${PROJECT_NAME}" -q)

if [ -n "$EXISTING_CONTAINERS" ]; then
    echo -e "${AMBER}Stopping and removing existing '${PROJECT_NAME}' project containers...${NC}"
    docker compose -p "${PROJECT_NAME}" down --remove-orphans
    echo -e "${GREEN}✔ Cleaned previous '${PROJECT_NAME}' containers safely (other system containers untouched).${NC}"
else
    echo -e "${GREEN}✔ No previous '${PROJECT_NAME}' containers found. Proceeding cleanly.${NC}"
fi

# 3. Configure .env for 100% Local Air-Gapped Mode
if [ ! -f .env ]; then
    echo -e "${AMBER}ℹ .env not found, creating with 100% local configuration...${NC}"
    cp .env.example .env
fi

# Ensure local MongoDB URI is set
if grep -q "^MONGODB_URI=" .env; then
    sed -i 's|^MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017/arogyasutra|' .env
else
    echo "MONGODB_URI=mongodb://localhost:27017/arogyasutra" >> .env
fi

# 4. Start Local MongoDB & Ollama Services
echo -e "\n${ORANGE}${BOLD}[1/4] Starting Local Air-Gapped Services (MongoDB & Ollama)...${NC}"
docker compose -p "${PROJECT_NAME}" up -d mongodb ollama

echo -e "${CYAN}Waiting for local Ollama and MongoDB engines to initialize...${NC}"
MAX_RETRIES=25
RETRY_COUNT=0
OLLAMA_READY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec arogyasutra-ollama ollama list &> /dev/null; then
        OLLAMA_READY=true
        break
    fi
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo -n "."
done
echo ""

if [ "$OLLAMA_READY" = false ]; then
    echo -e "${RED}[ERROR] Ollama container did not respond in time.${NC}"
    exit 1
fi
echo -e "${GREEN}✔ Local Ollama engine is responsive and healthy.${NC}"
echo -e "${GREEN}✔ Local MongoDB container is running (Zero Cloud Dependencies).${NC}"

# 5. Intelligent Model Resolution
echo -e "\n${ORANGE}${BOLD}[2/4] Resolving Local AI Model Configuration...${NC}"

# Query currently installed models in the container
INSTALLED_MODELS=$(docker exec arogyasutra-ollama ollama list | awk 'NR>1 {print $1}' | sed 's/:latest//' || true)

TARGET_MODEL=""

if [ -n "$REQUESTED_MODEL" ]; then
    TARGET_MODEL="$REQUESTED_MODEL"
    echo -e "${CYAN}Target model specified by argument: ${BOLD}${TARGET_MODEL}${NC}"
else
    # Check if any model is already installed in the container
    FIRST_INSTALLED=$(echo "$INSTALLED_MODELS" | head -n 1)
    if [ -n "$FIRST_INSTALLED" ] && [ "$FIRST_INSTALLED" != "NAME" ]; then
        TARGET_MODEL="$FIRST_INSTALLED"
        echo -e "${GREEN}Detected already installed model in Ollama: ${BOLD}${TARGET_MODEL}${NC}"
        echo -e "${AMBER}Using installed model without downloading again.${NC}"
    else
        TARGET_MODEL="$DEFAULT_FALLBACK_MODEL"
        echo -e "${AMBER}No model passed and no existing model found in Ollama.${NC}"
        echo -e "${CYAN}Defaulting to ultra-fast intelligent model: ${BOLD}${TARGET_MODEL}${NC}"
    fi
fi

# Check if target model needs to be pulled
MODEL_CHECK=$(docker exec arogyasutra-ollama ollama list | grep -E "^${TARGET_MODEL}(:latest)?\s" || true)

if [ -z "$MODEL_CHECK" ]; then
    echo -e "${AMBER}⬇ Pulling model '${TARGET_MODEL}' into local Ollama container...${NC}"
    docker exec -i arogyasutra-ollama ollama pull "${TARGET_MODEL}"
    echo -e "${GREEN}✔ Model '${TARGET_MODEL}' successfully installed!${NC}"
else
    echo -e "${GREEN}✔ Model '${TARGET_MODEL}' is already installed and ready.${NC}"
fi

# Update .env with active model
if grep -q "^OLLAMA_MODEL=" .env; then
    sed -i "s|^OLLAMA_MODEL=.*|OLLAMA_MODEL=${TARGET_MODEL}|" .env
else
    echo "OLLAMA_MODEL=${TARGET_MODEL}" >> .env
fi
echo -e "${GREEN}✔ Configured active model in .env: ${TARGET_MODEL}${NC}"

# 6. Build and Start Backend & Frontend
echo -e "\n${ORANGE}${BOLD}[3/4] Building and launching ArogyaSutra Fullstack Services...${NC}"
docker compose -p "${PROJECT_NAME}" up -d --build backend frontend

# 7. Final Verification and Status Dashboard
echo -e "\n${ORANGE}${BOLD}[4/4] Verifying Service Health...${NC}"
sleep 3

echo -e "${GREEN}${BOLD}"
echo "======================================================================"
echo "    🚀 AROGYASUTRA IS LIVE (100% LOCAL & AIR-GAPPED)!"
echo "======================================================================"
echo -e "${NC}"
echo -e "${BOLD}Access URLs:${NC}"
echo -e "  🌐 Web Dashboard:    ${CYAN}${BOLD}http://localhost:5173${NC}"
echo -e "  ⚙️  Backend API:      ${CYAN}${BOLD}http://localhost:5000${NC}"
echo -e "  🧠 Local Ollama LLM: ${CYAN}${BOLD}http://localhost:11434${NC} (Active: ${GREEN}${TARGET_MODEL}${NC})"
echo -e "  🍃 Local MongoDB:    ${CYAN}${BOLD}mongodb://localhost:27017/arogyasutra${NC} (Docker Local)"
echo ""
echo -e "${BOLD}Helpful Commands:${NC}"
echo -e "  View Logs:   ${AMBER}docker compose -p ${PROJECT_NAME} logs -f${NC}"
echo -e "  Stop Stack:  ${AMBER}docker compose -p ${PROJECT_NAME} down${NC}"
echo -e "  Pass Custom: ${AMBER}./run.sh llama3.2:3b${NC} or ${AMBER}./run.sh mistral${NC}"
echo ""
echo -e "${GREEN}Ready for your Hack2Heal 2.0 demonstration recording! 🎥${NC}"

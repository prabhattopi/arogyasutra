FROM node:22-alpine

WORKDIR /app

# Install dependencies first for optimal caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/

# Expose backend port
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Start using tsx for zero-compilation-lag native execution
CMD ["npx", "tsx", "src/index.ts"]

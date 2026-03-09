# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

# 2. Build project
COPY . .
RUN npm run build

# Production stage (minimal image)
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev \
    && npm cache clean --force

# Copy built output only (no source or devDependencies)
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000

# 3. Run
CMD ["node", "dist/main.js"]

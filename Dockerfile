FROM node:25-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:25-slim
WORKDIR /app

RUN curl -L --max-time 60 -o /tmp/bs3.tgz \
        "https://github.com/WiseLibs/better-sqlite3/releases/download/v12.10.0/better-sqlite3-v12.10.0-node-v137-linux-x64.tar.gz" \
        && echo "=== CURL OK ===" || echo "=== CURL FAILED ==="

COPY --from=build /app/.output/ ./
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000
CMD ["node", "server/index.mjs"]
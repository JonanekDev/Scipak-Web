FROM node:25-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:25-slim
WORKDIR /app

COPY --from=build /app/.output/ ./
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000
CMD ["node", "server/index.mjs"]
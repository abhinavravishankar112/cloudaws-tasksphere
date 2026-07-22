FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY src ./src
COPY prisma ./prisma
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager?schema=public
RUN npx prisma generate
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY package*.json ./
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs && chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
CMD ["node", "src/server.js"]

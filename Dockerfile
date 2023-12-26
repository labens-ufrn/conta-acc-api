FROM node:21-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./

ARG DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/contaacc?schema=public"
ARG PORT=3000

RUN echo "DATABASE_URL= $DATABASE_URL" > .env
RUN echo "PORT=$PORT" >> .env

USER nodejs

EXPOSE $PORT

RUN npx prisma migrate deploy

CMD ["yarn", "start"]
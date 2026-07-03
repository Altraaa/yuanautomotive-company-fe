# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Yuan Dewata Automotive — Next.js 16 (standalone) multi-stage build
# ----------------------------------------------------------------------------
# Catatan: variabel NEXT_PUBLIC_* di-inline saat `next build`, jadi harus
# tersedia sebagai build ARG (lihat docker-compose.yml / perintah build).
# REVALIDATE_SECRET dipakai saat runtime (route handler), jadi cukup diset
# lewat environment container (bukan build arg).
# ----------------------------------------------------------------------------

FROM node:22-alpine AS base
# libc6-compat dibutuhkan beberapa dependency native di Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Dependencies (cache layer) --------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder ----------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public env (di-inline ke bundle client).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runner (production) ----------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# User non-root untuk keamanan.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Output standalone sudah berisi node_modules minimal + server.js.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]

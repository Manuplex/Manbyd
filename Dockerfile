# syntax=docker/dockerfile:1
FROM node:22-alpine AS builder

WORKDIR /app

# Installer pnpm et nettoyer les caches
RUN <<EOF
set -e
npm install -g pnpm@9.6.0
npm cache clean --force
EOF

# Copier les fichiers de dépendances
COPY pnpm-lock.yaml package.json ./

# Installer les dépendances avec cache mounts BuildKit
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    --mount=type=cache,id=npm,target=/root/.npm \
    pnpm install --frozen-lockfile --prefer-offline

# Copier le code source
COPY . .

# On utilise EXACTEMENT les noms attendus par Next.js


# On utilise EXACTEMENT les noms attendus par Next.js

ARG supabaseUrl
ARG supabaseserviceroleKey
ARG WEBHOOK_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GTM_ID


# On les transforme en variables d'environnement pour le build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV supabaseUrl=$supabaseUrl
ENV supabaseserviceroleKey=$supabaseserviceroleKey
ENV WEBHOOK_URL=$WEBHOOK_URL
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID


# Build l'application et nettoyer les caches
RUN <<EOF
set -e
pnpm run build
pnpm install --prod --frozen-lockfile
pnpm store prune
EOF

# Stage 2: Runtime - Image minimale
FROM node:22-alpine

WORKDIR /app

# Variables pour optimiser la mémoire Node.js
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=512"

# Installer pnpm uniquement (sans npm)
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm install -g pnpm@9.6.0 --no-save && \
    npm cache clean --force

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/next.config.ts ./next.config.ts

# User non-root pour la sécurité
USER node

# Exposer le port
EXPOSE 3000

# Health check optimisé
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Lancer l'application
CMD ["pnpm", "start"]


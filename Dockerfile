# ---- Build stage ----
FROM node:24-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
RUN printf "\nauto-install-peers=true\nnode-linker=hoisted\nstrict-peer-dependencies=false\n" >> .npmrc
RUN rm -f pnpm-lock.yaml && pnpm install --no-frozen-lockfile
RUN pnpm --filter @workspace/razr-agency run build
RUN pnpm --filter @workspace/api-server run build

# ---- Runtime stage ----
# Single container serving both the API (Express, bundle in dist/index.mjs) and
# the built SPA (dist/public). Requires env: DATABASE_URL, JWT_SECRET, PORT.
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/artifacts/api-server/dist ./dist
COPY --from=build /app/artifacts/razr-agency/dist/public ./dist/public
EXPOSE 3000
# Bootstrap the database schema + optional SUPER_ADMIN seed before starting the API
CMD ["sh", "-c", "node dist/bootstrap-db.mjs && node dist/index.mjs"]

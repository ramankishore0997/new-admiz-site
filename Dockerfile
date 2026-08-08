FROM node:24-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
COPY . .
ENV PORT=3000
ENV BASE_PATH=/
RUN printf "\nauto-install-peers=true\nnode-linker=hoisted\nstrict-peer-dependencies=false\n" >> .npmrc
RUN rm -f pnpm-lock.yaml && pnpm install --no-frozen-lockfile
RUN pnpm --filter @workspace/razr-agency run build

FROM node:24-slim
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/artifacts/razr-agency/dist/public ./dist
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]

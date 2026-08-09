import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import * as telegramNotify from "./lib/telegram/service";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS configuration supporting credentials (cookies) in dev & prod.
// Origins are whitelisted explicitly — the API never reflects arbitrary origins.
const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://legendary-kitsune-1449d7.netlify.app",
];
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .concat(DEFAULT_ALLOWED_ORIGINS),
);

// CORS is applied ONLY to API routes — static assets/SPA must never be CORS-checked.
// Same-origin browser requests (Origin === Host) are always allowed, so any
// deployment URL works without extra config; other origins need the whitelist.
function corsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const origin = req.headers.origin;
  const host = req.get("host");
  const sameOrigin = !!origin && !!host && (origin === `https://${host}` || origin === `http://${host}`);
  if (!origin || sameOrigin || allowedOrigins.has(origin)) {
    return cors({ origin: true, credentials: true })(req, res, next);
  }
  const err: any = new Error("Origin not allowed by CORS");
  err.status = 403;
  return next(err);
}

app.use(cookieParser());
app.use(express.json({ limit: "15mb" })); // Support large base64 uploads
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/api", corsMiddleware);
app.use("/api", router);
app.use(router);

// Serve the built frontend (single-container production mode, e.g. Railway/Docker).
// The SPA is served from <cwd>/dist/public; if it isn't present, the API-only
// mode stays intact (local dev runs the Vite dev server separately).
const frontendDist = path.resolve(process.cwd(), "dist/public");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const isApi = req.path.startsWith("/api");
    const lastSegment = req.path.split("/").filter(Boolean).pop() || "";
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(lastSegment);
    if (req.method !== "GET" || isApi || hasFileExtension) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Global JSON error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Telegram admin notification for critical backend errors only (fail-soft,
  // sanitized: no stack traces, no secrets, no credentials).
  if (status >= 500) {
    void telegramNotify.notifySystemError({ service: "api", endpoint: req.originalUrl, error: message });
  }

  return res.status(status).json({ error: message });
});

export default app;

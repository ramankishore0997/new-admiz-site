import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

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

// CORS configuration supporting credentials (cookies) in dev
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "15mb" })); // Support large base64 uploads
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/api", router);

// Global JSON error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(status).json({ error: message });
});

export default app;

import "./netlify-env";
import serverless from "serverless-http";
import express from "../../artifacts/api-server/node_modules/express/index.js";
import app from "../../artifacts/api-server/src/app";

// serverless-http attaches the raw request body to req.body as a Buffer and
// marks the request as "complete". body-parser 2.2.x then skips parsing
// (onFinished.isFinished(req) === true), so the app would receive an unparsed
// Buffer. Parse the body here before the Express app runs.
const wrapper = express();
wrapper.use((req, _res, next) => {
  const raw: unknown = (req as any).body;
  if (Buffer.isBuffer(raw) && raw.length > 0) {
    const contentType = String((req as any).headers["content-type"] || "");
    const text = raw.toString("utf8");
    try {
      if (contentType.includes("application/json")) {
        (req as any).body = JSON.parse(text);
        return next();
      }
      if (contentType.includes("application/x-www-form-urlencoded")) {
        (req as any).body = Object.fromEntries(new URLSearchParams(text));
        return next();
      }
    } catch {
      // leave the raw body untouched; downstream parsers surface the error
    }
  }
  next();
});
wrapper.use(app);

export const handler = serverless(wrapper);

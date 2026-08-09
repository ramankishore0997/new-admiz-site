// Must be imported before the API app: Netlify does not set NODE_ENV for
// function runtimes. Without it the app picks the development logging path
// (pino-pretty worker transport), which crashes inside the bundled function.
process.env.NODE_ENV = process.env.NODE_ENV || "production";

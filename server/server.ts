import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { setGlobalDispatcher, Agent } from "undici";
import { createServer as createViteServer } from "vite";

// Router imports
import assessmentRouter from "./routes/assessment.route";
import coachRouter from "./routes/coach.route";
import journalRouter from "./routes/journal.route";
import simulatorRouter from "./routes/simulator.route";
import nudgesRouter from "./routes/nudges.route";

// Middleware imports
import { helmetMiddleware } from "./middleware/helmet";
import { errorHandlerMiddleware } from "./middleware/errorHandler";

dotenv.config();

// Protect against Google GenAI chunk transfer time gaps
setGlobalDispatcher(
  new Agent({
    headersTimeout: 180000,
    bodyTimeout: 180000,
    connectTimeout: 180000,
  })
);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(helmetMiddleware);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development", time: new Date().toISOString() });
});

// Mounted Modular Routes
app.use("/api/carbon-assessment", assessmentRouter);
app.use("/api/coach-chat", coachRouter);
app.use("/api/journal-analysis", journalRouter);
app.use("/api/narrative-report", simulatorRouter);
app.use("/api/nudges", nudgesRouter);

// Unhandled routing errors
app.use(errorHandlerMiddleware);

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening perfectly on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Express critical boot fault:", err);
});

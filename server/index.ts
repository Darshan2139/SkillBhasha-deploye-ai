import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { generateContent, chat, translate, generateQuiz, summarize } from "./routes/ai";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // AI API routes
  app.post("/api/ai/generate-content", generateContent);
  app.post("/api/ai/chat", chat);
  app.post("/api/ai/translate", translate);
  app.post("/api/ai/generate-quiz", generateQuiz);
  app.post("/api/ai/summarize", summarize);

  return app;
}

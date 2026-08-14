import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { initDb } from "../server/storage";
import { registerRoutes } from "../server/routes/index";

const app = express();

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let dbInitPromise: Promise<void> | null = null;

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!dbInitPromise && process.env.DATABASE_URL) {
    dbInitPromise = initDb().catch(console.error) as Promise<void>;
  }
  await dbInitPromise;
  next();
});

const httpServer = createServer(app);
registerRoutes(httpServer, app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

export default app;

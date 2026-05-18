import type { Express } from "express";
import { createServer, type Server } from "http";
import http from "http";
import path from "path";
import express from "express";

const RUST_API_PORT = 3001;

function proxyToRust(req: any, res: any) {
  // Express body parsers consume the stream — rebuild body from parsed data
  const bodyMethods = ["POST", "PUT", "PATCH"];
  const rawBody: Buffer | null =
    bodyMethods.includes(req.method) && req.rawBody instanceof Buffer
      ? req.rawBody
      : null;

  const headers: Record<string, string | string[]> = {
    ...req.headers,
    host: `localhost:${RUST_API_PORT}`,
  };

  if (rawBody) {
    headers["content-length"] = String(rawBody.length);
    if (!headers["content-type"]) {
      headers["content-type"] = "application/json";
    }
  }

  const options = {
    hostname: "localhost",
    port: RUST_API_PORT,
    path: req.originalUrl,
    method: req.method,
    headers,
  };

  const proxy = http.request(options, (proxyRes) => {
    const forwardHeaders = { ...proxyRes.headers };
    delete forwardHeaders["access-control-allow-origin"];
    res.writeHead(proxyRes.statusCode ?? 500, forwardHeaders);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on("error", () => {
    res.status(503).json({ error: "Rust API server unavailable" });
  });

  if (rawBody) {
    proxy.write(rawBody);
    proxy.end();
  } else {
    req.pipe(proxy, { end: true });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded media files
  const uploadsPath = path.join(process.cwd(), "rust_server", "uploads");
  app.use("/uploads", express.static(uploadsPath));

  // Proxy all /api/* to Rust server
  app.use("/api", proxyToRust);

  return httpServer;
}

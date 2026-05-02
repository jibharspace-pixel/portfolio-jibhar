import type { Express } from "express";
import { createServer, type Server } from "http";
import http from "http";
import path from "path";
import express from "express";

const RUST_API_PORT = 3001;

function proxyToRust(req: any, res: any) {
  const options = {
    hostname: "localhost",
    port: RUST_API_PORT,
    path: req.originalUrl,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${RUST_API_PORT}`,
    },
  };

  const proxy = http.request(options, (proxyRes) => {
    // Forward Rust headers but let Express manage CORS at the outer layer
    const forwardHeaders = { ...proxyRes.headers };
    delete forwardHeaders["access-control-allow-origin"];
    res.writeHead(proxyRes.statusCode ?? 500, forwardHeaders);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on("error", () => {
    res.status(503).json({ error: "Rust API server unavailable" });
  });

  req.pipe(proxy, { end: true });
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

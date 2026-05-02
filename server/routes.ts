import type { Express } from "express";
import { createServer, type Server } from "http";
import http from "http";

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
    res.writeHead(proxyRes.statusCode ?? 500, {
      ...proxyRes.headers,
      "access-control-allow-origin": "*",
    });
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
  app.use("/api", proxyToRust);
  return httpServer;
}

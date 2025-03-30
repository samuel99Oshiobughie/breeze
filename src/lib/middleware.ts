import { NextApiRequest, NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "@/interface/interface";
import dbConnect from "./db";
import * as cookie from "cookie";
import { v4 as uuidv4 } from "uuid";

// ✅ 1. Replace CORS with a native implementation
const corsMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }
  return true;
};

const rateLimitStore = new Map<string, { count: number; startTime: number }>();

const rateLimitMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
  const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const ip = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;

  const now = Date.now();
  const resetTime = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
  } else {
    const entry = rateLimitStore.get(ip)!;
    
    if (now - entry.startTime > resetTime) {
      // Reset count after 15 minutes
      rateLimitStore.set(ip, { count: 1, startTime: now });
    } else {
      if (entry.count >= maxRequests) {
        res.setHeader("Retry-After", `${resetTime / 1000}`);
        res.status(429).json({ error: "Too many requests, please try again later." });
        return false;
      }
      entry.count += 1;
    }
  }

  return true;
};


// ✅ 3. Session Middleware (No Express)
export function sessionMiddleware(req: ExtendedNextApiRequest, res: NextApiResponse) {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();

    try {
      const serializedCookie = cookie.serialize("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      res.setHeader("Set-Cookie", serializedCookie);
    } catch (error) {
      console.error("Failed to serialize cookie:", error);
      res.status(500).json({ error: "Failed to set session cookie" });
      return;
    }
  }

  req.sessionId = sessionId;
}

// ✅ 4. Apply Middleware (No Express Wrapping)
export function applyMiddleware(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await dbConnect();

      if (!corsMiddleware(req, res)) return;
      if (!rateLimitMiddleware(req, res)) return;

      sessionMiddleware(req as ExtendedNextApiRequest, res);

      await handler(req, res);
    } catch (error) {
      console.error("Middleware Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

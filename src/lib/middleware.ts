import { NextApiRequest, NextApiResponse } from 'next'
import { ExtendedNextApiRequest } from '@/interface/interface'
import dbConnect from './db'
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const getIP = (req: any) => {
  return (
    req.headers["x-forwarded-for"] || // Get real IP if behind a proxy
    req.connection?.remoteAddress ||  // Fallback to remote address
    req.socket?.remoteAddress ||
    "127.0.0.1" // Default localhost IP
  );
};



export function sessionMiddleware(req: ExtendedNextApiRequest, res: NextApiResponse, next: () => void) {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
      sessionId = uuidv4();
      res.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 1 days
          path: '/'
      }));
  }



  req.sessionId = sessionId;
  next();
}

const corsMiddleware = cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
const helmetMiddleware = helmet();
const morganMiddleware = process.env.NODE_ENV !== 'production' ? morgan('dev') : morgan('combined');
const rateLimitMiddleware = rateLimit({
   windowMs: 15 * 60 * 1000, 
   max: 100,
   keyGenerator: getIP, // Use the function to get IP
   message: "Too many requests, please try again later.", 
  });
const cookieParserMiddleware = cookieParser();
const compressionMiddleware = compression();


const logger = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Helper to promisify Express middleware
const promisifyMiddleware = (
    middleware: (req: any, res: any, next: (err?: any) => void) => void
  ) => {
    return (req: NextApiRequest, res: NextApiResponse) =>
      new Promise<void>((resolve, reject) => {
        middleware(req as any, res as any, (err?: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
  };
  
  export function applyMiddleware(handler: Handler): Handler {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {

        await dbConnect();
        
        await Promise.all([
          promisifyMiddleware(corsMiddleware)(req, res),
          promisifyMiddleware(helmetMiddleware)(req, res),
          promisifyMiddleware(morganMiddleware)(req, res),
          promisifyMiddleware(rateLimitMiddleware)(req, res),
          promisifyMiddleware(cookieParserMiddleware)(req, res),
          promisifyMiddleware(compressionMiddleware)(req, res),
          promisifyMiddleware(sessionMiddleware)(req, res),
          promisifyMiddleware(logger)(req, res),
        ]);

        await handler(req, res);
      } catch (error) {
        console.error("Middleware Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
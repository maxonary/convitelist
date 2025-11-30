import session from "express-session";
import { Express } from "express";

export const configureSession = (app: Express) => {
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is required. Do not use default secrets in production.');
  }

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        httpOnly: true,
        maxAge: 3600000, // Session expiration time (in milliseconds)
        sameSite: 'strict', // CSRF protection
      },
    })
  );
};

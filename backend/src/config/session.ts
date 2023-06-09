import session from "express-session";
import { Express } from "express";

export const configureSession = (app: Express) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set it to 'true' if using HTTPS
        httpOnly: true,
        maxAge: 3600000, // Session expiration time (in milliseconds)
      },
    })
  );
};

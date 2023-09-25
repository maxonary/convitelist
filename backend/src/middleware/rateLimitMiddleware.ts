import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: "Rate limit exceeded. Please try again later.",
});

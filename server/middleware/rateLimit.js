import rateLimit from "express-rate-limit";

const baseOptions= {
  windowMs: 60_000,
  standardHeaders: true,
  legacyHeaders: false,
};

export const readLimiter= rateLimit({
  ...baseOptions,
  max: 60,
});

export const writeLimiter= rateLimit({
  ...baseOptions,
  max: 30,
});

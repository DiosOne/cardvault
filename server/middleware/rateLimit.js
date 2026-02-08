const DEFAULT_MESSAGE= "Too many requests. Please try again later.";

const buildDefaultKey= (req) => {
  if (req.user?.id) return `user:${req.user.id}`;
  return `ip:${req.ip}`;
};

const sweepExpired= (store, now) => {
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
};

export const createRateLimiter= ({
  windowMs= 60_000,
  max= 60,
  keyGenerator= buildDefaultKey,
  message= DEFAULT_MESSAGE,
} = {}) => {
  const store= new Map();

  return (req, res, next) => {
    const now= Date.now();
    const key= keyGenerator(req);
    const entry= store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, {count: 1, resetAt: now + windowMs});
    } else {
      entry.count += 1;
    }

    if (store.size > 5000) {
      sweepExpired(store, now);
    }

    const current= store.get(key);
    if (current.count > max) {
      res.status(429).json({
        success: false,
        message,
      });
      return;
    }

    res.set("X-RateLimit-Limit", String(max));
    res.set("X-RateLimit-Remaining", String(Math.max(0, max - current.count)));
    res.set("X-RateLimit-Reset", String(Math.ceil(current.resetAt / 1000)));
    next();
  };
};

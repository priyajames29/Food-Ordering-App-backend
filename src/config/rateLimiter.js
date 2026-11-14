import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: true, // for learning purpose it is true

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  message: {
    message: "Too many requests. Please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: true,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "auth-rate-limit:",
  }),
  message: {
    message: "Too many authentication attempts. Try again later.",
  },
});

export default apiLimiter;

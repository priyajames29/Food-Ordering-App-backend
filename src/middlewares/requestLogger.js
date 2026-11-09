import pinoHttp from "pino-http";
import logger from "../config/logger.js";

const requestLogger = pinoHttp({
  logger,

  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  customProps: (req) => ({
    userId: req.user?.id,
  }),

  redact: ["req.headers.authorization", "req.headers.cookie"],
});

export default requestLogger;

import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";

import "./models/index.js";
import redisClient from "./config/redis.js";
import logger from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    // console.log("Database connected");
    logger.info("Database connected successfully");

    await sequelize.sync({
      alter: true,
    });
    // console.log("Models synced");
    logger.info("Models synced successfully");

    // Connect to Redis
    try {
      await redisClient.connect();
    } catch (error) {
      logger.error("Redis unavailable:");
      console.log("Application will continue without caching");
    }
    logger.info("Redis connected successfully");

    app.listen(PORT, () => {
      // console.log(`Server running on port ${PORT}`);
      logger.info({ port: PORT }, "Server started");
    });
  } catch (error) {
    // console.error(error);
    logger.fatal({ err: error }, "Application startup failed");
    process.exit(1);
  }
}

startServer();

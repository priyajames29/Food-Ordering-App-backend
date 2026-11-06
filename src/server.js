import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";

import "./models/index.js";
import redisClient from "./config/redis.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({
      alter: true,
    });
    console.log("Models synced");

    // Connect to Redis
    try {
      await redisClient.connect();
    } catch (error) {
      console.error("Redis unavailable:", error.message);
      console.log("Application will continue without caching");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();

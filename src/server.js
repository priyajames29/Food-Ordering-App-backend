import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";

import "./models/index.js";

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

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();

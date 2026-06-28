import express from "express";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server running",
  });
});

app.use("/users", userRoutes);
app.use("/restaurants", restaurantRoutes);

export default app;

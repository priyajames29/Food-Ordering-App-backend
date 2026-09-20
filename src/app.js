import express from "express";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import menuItemsRoutes from "./routes/menuItemsRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server running",
  });
});

app.use("/users", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menu-items", menuItemsRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);

export default app;

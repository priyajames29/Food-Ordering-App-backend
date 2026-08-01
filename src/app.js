import express from "express";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuItems from "./routes/menuItemsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server running",
  });
});

app.use("/users", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menu-item", menuItems);
app.use("/orders", orderRoutes);

export default app;

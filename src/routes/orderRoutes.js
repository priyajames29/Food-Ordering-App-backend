import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { placeOrder } from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post(
  "/",
  authenticateUser,
  authorizeRole("customer", "admin"),
  placeOrder,
);

export default orderRoutes;

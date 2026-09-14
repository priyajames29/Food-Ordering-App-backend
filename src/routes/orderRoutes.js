import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { placeOrder } from "../controllers/orderController.js";
import { createOrderSchema } from "../validators/orderValidator.js";

const orderRoutes = express.Router();

orderRoutes.post(
  "/",
  authenticateUser,
  authorizeRole("customer", "admin"),
  validateRequest(createOrderSchema),
  placeOrder,
);

export default orderRoutes;

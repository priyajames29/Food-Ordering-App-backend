import express from "express";
import { Roles } from "../constants/roles.js";
import {
  createRestaurantController,
  deleteRestaurant,
  getMyRestaurants,
  getRestaurantFromIdController,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurantController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { checkRestaurantOwnership } from "../middlewares/checkRestaurantOwnership.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createRestaurantSchema } from "../validators/restaurantValidator.js";

const restaurantRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Spice Garden
 *         location:
 *           type: string
 *           example: 12 MG Road, Bengaluru
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "987654321"
 *         openingTime:
 *           type: string
 *           nullable: true
 *           example: "09:00"
 *         closingTime:
 *           type: string
 *           nullable: true
 *           example: "22:00"
 *         userId:
 *           type: integer
 *           description: ID of the restaurant owner
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     description: >
 *       Returns every restaurant, newest first. Public endpoint, no token needed.
 *       Results are cached in Redis for 5 minutes and the cache is cleared when a
 *       restaurant is created, updated or deleted.
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurant:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
restaurantRoutes.get("/", getRestaurants);

restaurantRoutes.get(
  "/mine",
  authenticateUser,
  authorizeRole(Roles.ADMIN, Roles.RESTAURANT_OWNER),
  getMyRestaurants,
);

restaurantRoutes.get("/:id", getRestaurantFromIdController);

restaurantRoutes.post(
  "/",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  validateRequest(createRestaurantSchema),
  createRestaurantController,
);

restaurantRoutes.put(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  checkRestaurantOwnership,
  updateRestaurant,
);

restaurantRoutes.delete(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  checkRestaurantOwnership,
  deleteRestaurant,
);

export default restaurantRoutes;

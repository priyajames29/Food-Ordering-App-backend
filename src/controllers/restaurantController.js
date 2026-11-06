import { Roles } from "../constants/roles.js";
import {
  createRestaurant,
  deleteRestaurantService,
  getAllRestaurant,
  getRestaurantsForUser,
  getRestaurantFromId,
  updateRestaurantService,
} from "../services/restaurantService.js";
import { sendError } from "../utils/errors.js";

export async function getRestaurants(req, res) {
  try {
    const restaurant = await getAllRestaurant();
    res.json({ restaurant });
  } catch (error) {
    sendError(res, error);
  }
}

export async function getMyRestaurants(req, res) {
  try {
    const restaurant =
      req.user.role === Roles.ADMIN
        ? await getAllRestaurant()
        : await getRestaurantsForUser(req.user.id);
    res.json({ restaurant });
  } catch (error) {
    sendError(res, error);
  }
}

export async function createRestaurantController(req, res) {
  try {
    const restaurant = await createRestaurant({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function updateRestaurant(req, res) {
  try {
    const restaurant = await getRestaurantFromId(req.params);
    if (restaurant) {
      await updateRestaurantService(req.body, restaurant.dataValues);
    } else {
      res.status(400).json("Restaurant not found");
    }
    res.status(201).json("ok");
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getRestaurantFromIdController(req, res) {
  try {
    const restaurant = await getRestaurantFromId(req.params);
    res.json({ restaurant });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const restaurant = await getRestaurantFromId(req.params);
    if (restaurant) {
      await deleteRestaurantService(req.params.id);
      res.status(201).json({ message: "deleted" });
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    sendError(res, error);
  }
}

import {
  createRestaurant,
  deleteRestaurantService,
  getAllRestaurant,
  getRestaurantFromId,
} from "../services/restaurantService.js";
import { createRestaurantSchema } from "../validators/restrauntValidator.js";

export async function getRestaurants(req, res) {
  const restaurant = await getAllRestaurant();
  console.log("get /Restaurant");

  res.json({ restaurant });
}

export async function createRestaurantController(req, res) {
  try {
    const validatedData = createRestaurantSchema.parse(req.body);

    const restaurant = await createRestaurant(validatedData);

    res.status(201).json(restaurant);
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
      res.status(201).json({ message: "Restraunt not found" });
    }
  } catch (error) {
    throw error;
  }
}

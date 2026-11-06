import { Restaurant } from "../models/Restaurant.js";
import { getOrSetCache } from "./cacheServices.js";

const RESTAURANTS_CACHE_KEY = "cache:food-ordering:restaurants:list:v1";

const RESTAURANTS_CACHE_TTL = 300;

export async function getAllRestaurants() {
  return await getOrSetCache(
    RESTAURANTS_CACHE_KEY,
    RESTAURANTS_CACHE_TTL,
    async () => {
      const restaurants = await Restaurant.findAll({
        order: [["createdAt", "DESC"]],
      });

      return restaurants.map((restaurant) => restaurant.toJSON());
    },
  );
}

// export async function getAllRestaurant() {
//   return Restaurant.findAll();
// }

export async function getRestaurantsForUser(userId) {
  return Restaurant.findAll({ where: { userId } });
}

export async function createRestaurant(data) {
  return Restaurant.create(data);
}

export async function getRestaurantFromId(params) {
  return Restaurant.findOne({ where: { id: params.id } });
}

export async function deleteRestaurantService(id) {
  return Restaurant.destroy({ where: { id } });
}

export async function updateRestaurantService(body, restaurant) {
  return Restaurant.update(
    { ...restaurant, ...body },
    { where: { id: restaurant.id } },
  );
}

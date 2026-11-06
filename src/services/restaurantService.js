import { Restaurant } from "../models/Restaurant.js";

export async function getAllRestaurant() {
  return Restaurant.findAll();
}

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

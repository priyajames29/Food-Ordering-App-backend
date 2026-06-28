import { Restaurant } from "../models/Restaurant.js";

export async function getAllRestaurant() {
  return await Restaurant.findAll();
}

export async function createRestaurant(data) {
  try {
    return await Restaurant.create(data);
  } catch (error) {
    throw error;
  }
}

export async function getRestaurantFromId(params) {
  try {
    const data = await Restaurant.findOne({
      where: {
        id: params.id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteRestaurantService(id) {
  console.log("here", id);
  try {
    return Restaurant.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
}

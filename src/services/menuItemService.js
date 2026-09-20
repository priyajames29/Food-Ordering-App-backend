import { MenuItems } from "../models/MenuItems.js";

export async function createMenuItemService(data) {
  try {
    return await MenuItems.create({
      ...data,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function getMenuItemsService() {
  try {
    return await MenuItems.findAll();
  } catch (error) {
    throw new Error(error);
  }
}
export async function getMenuItemsRestaurantService(params) {
  try {
    console.log("service", params);
    const data = await MenuItems.findAll({
      where: {
        restaurantId: params.restaurantId,
      },
    });
    return data;
  } catch (error) {}
}

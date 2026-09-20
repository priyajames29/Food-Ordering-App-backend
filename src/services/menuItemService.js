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

export async function getMenuItemByIdService(params) {
  try {
    const data = await MenuItems.findOne({
      where: {
        id: params.id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateMenuItemService(body, menuItem) {
  try {
    return MenuItems.update(
      {
        ...menuItem,
        ...body,
      },
      {
        where: {
          id: menuItem.id,
        },
      },
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteMenuItemService(id) {
  try {
    return MenuItems.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
}

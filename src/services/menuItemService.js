import { MenuItems } from "../models/MenuItems.js";

export async function createMenuItemService(data) {
  return MenuItems.create({ ...data });
}

export async function getMenuItemsService() {
  return MenuItems.findAll();
}

export async function getMenuItemsRestaurantService(params) {
  return MenuItems.findAll({
    where: { restaurantId: params.restaurantId },
  });
}

export async function getMenuItemByIdService(params) {
  return MenuItems.findOne({ where: { id: params.id } });
}

export async function updateMenuItemService(body, menuItem) {
  return MenuItems.update(
    { ...menuItem, ...body },
    { where: { id: menuItem.id } },
  );
}

export async function deleteMenuItemService(id) {
  return MenuItems.destroy({ where: { id } });
}

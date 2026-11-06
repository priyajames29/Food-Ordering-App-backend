import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";
import { MenuItems } from "../models/MenuItems.js";
import { getOrSetCache } from "./cacheServices.js";
import { OrderStatus } from "../constants/orderStatus.js";

export const TOP_MENU_ITEMS_CACHE_KEY = "cache:food-ordering:menu-items:top:v1";

const TOP_MENU_ITEMS_CACHE_TTL = 300;

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

export async function getTopMenuItems() {
  return await getOrSetCache(
    TOP_MENU_ITEMS_CACHE_KEY,
    TOP_MENU_ITEMS_CACHE_TTL,
    async () => {
      const topMenuItems = await sequelize.query(
        `
        SELECT
          mi.id,
          mi.name,
          mi.price,
          mi."restaurantId",
          SUM(oi.quantity) AS "totalOrdered"
        FROM "OrderItems" AS oi
        JOIN "MenuItems" AS mi
          ON mi.id = oi."menuItemId"
        JOIN "Orders" AS o
          ON o.id = oi."orderId"
        WHERE o.status = :status
        GROUP BY
          mi.id,
          mi.name,
          mi.price,
          mi."restaurantId"
        ORDER BY "totalOrdered" DESC
        LIMIT 10;
        `,
        {
          replacements: { status: OrderStatus.DELIVERED },
          type: QueryTypes.SELECT,
        },
      );

      return topMenuItems;
    },
  );
}

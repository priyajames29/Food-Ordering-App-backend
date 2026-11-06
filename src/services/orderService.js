import sequelize from "../config/database.js";
import { MenuItems } from "../models/MenuItems.js";
import { Orders } from "../models/Orders.js";
import { OrderItems } from "../models/OrderItems.js";
import { Restaurant } from "../models/Restaurant.js";
import { AppError } from "../utils/errors.js";

const toCents = (decimal) => Math.round(Number(decimal) * 100);
const fromCents = (cents) => (cents / 100).toFixed(2);

export async function createOrderService(userId, data) {
  const { restaurantId, items } = data;
  const menuItemIds = items.map((item) => item.menuItemId);

  return sequelize.transaction(async (transaction) => {
    const menuItems = await MenuItems.findAll({
      where: { id: menuItemIds, restaurantId },
      transaction,
      lock: transaction.LOCK.SHARE,
    });

    if (menuItems.length !== new Set(menuItemIds).size) {
      throw new AppError("One or more menu items are invalid for this restaurant");
    }

    const menuItemsById = new Map(menuItems.map((item) => [item.id, item]));

    let totalCents = 0;
    const orderItemsData = items.map(({ menuItemId, quantity }) => {
      const menuItem = menuItemsById.get(menuItemId);

      if (!menuItem.isAvailable) {
        throw new AppError(`Menu item "${menuItem.name}" is not available`);
      }

      const lineCents = toCents(menuItem.price) * quantity;
      totalCents += lineCents;

      return { menuItemId, quantity, price: fromCents(lineCents) };
    });

    const order = await Orders.create(
      {
        userId,
        restaurantId,
        status: "pending",
        totalPrice: fromCents(totalCents),
        orderedAt: new Date(),
      },
      { transaction },
    );

    await OrderItems.bulkCreate(
      orderItemsData.map((item) => ({ ...item, orderId: order.id })),
      { transaction },
    );

    return Orders.findOne({
      where: { id: order.id },
      include: [{ model: OrderItems, as: "orderItems" }],
      transaction,
    });
  });
}

export async function getAllOrdersService() {
  return Orders.findAll();
}

export async function getOrdersForCustomerService(userId) {
  return Orders.findAll({
    where: { userId },
    include: [{ model: OrderItems, as: "orderItems" }],
    order: [["createdAt", "DESC"]],
  });
}

export async function getOrdersForRestaurantOwnerService(userId) {
  const restaurants = await Restaurant.findAll({ where: { userId } });

  return Orders.findAll({
    where: { restaurantId: restaurants.map((r) => r.id) },
    include: [{ model: OrderItems, as: "orderItems" }],
    order: [["createdAt", "DESC"]],
  });
}

export async function getOrderByIdService(id) {
  return Orders.findOne({
    where: { id },
    include: [{ model: OrderItems, as: "orderItems" }],
  });
}

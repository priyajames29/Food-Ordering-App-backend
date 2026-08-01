import sequelize from "../config/database.js";
import { MenuItems } from "../models/MenuItems.js";
import { Orders } from "../models/Orders.js";
import { OrderItems } from "../models/OrderItems.js";

export async function createOrderService(userId, data) {
  const { restaurantId, items } = data;

  try {
    const menuItemIds = items.map((item) => item.menuItemId);

    const menuItems = await MenuItems.findAll({
      where: { id: menuItemIds, restaurantId },
    });

    if (menuItems.length !== new Set(menuItemIds).size) {
      throw new Error(
        "One or more menu items are invalid for this restaurant",
      );
    }

    const menuItemsById = new Map(menuItems.map((item) => [item.id, item]));

    let totalPrice = 0;
    const orderItemsData = items.map(({ menuItemId, quantity }) => {
      const menuItem = menuItemsById.get(menuItemId);

      if (!menuItem.isAvailable) {
        throw new Error(`Menu item "${menuItem.name}" is not available`);
      }

      const price = Number(menuItem.price) * quantity;
      totalPrice += price;

      return { menuItemId, quantity, price };
    });

    return await sequelize.transaction(async (transaction) => {
      const order = await Orders.create(
        {
          userId,
          restaurantId,
          status: "pending",
          totalPrice,
          orderedAt: new Date().toISOString(),
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
  } catch (error) {
    throw error;
  }
}

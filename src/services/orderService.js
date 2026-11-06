import sequelize from "../config/database.js";
import { MenuItems } from "../models/MenuItems.js";
import { Orders } from "../models/Orders.js";
import { OrderItems } from "../models/OrderItems.js";
import { Restaurant } from "../models/Restaurant.js";
import { AppError } from "../utils/errors.js";
import {
  ORDER_STATUS_TRANSITIONS,
  OrderStatus,
} from "../constants/orderStatus.js";
import { Roles } from "../constants/roles.js";
import { deleteCache } from "./cacheServices.js";
import { TOP_MENU_ITEMS_CACHE_KEY } from "./menuItemService.js";

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
        status: OrderStatus.PENDING,
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

export async function updateOrderStatusService(orderId, newStatus, user) {
  const updatedOrder = await sequelize.transaction(async (transaction) => {
    const order = await Orders.findOne({
      where: { id: orderId },
      include: [{ model: Restaurant, as: "restaurant" }],
      transaction,
      lock: { level: transaction.LOCK.UPDATE, of: Orders },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (user.role === Roles.RESTAURANT_OWNER) {
      if (order.restaurant?.userId !== user.id) {
        throw new AppError("Access denied", 403);
      }
    } else if (user.role === Roles.CUSTOMER) {
      // Customers may only cancel their own orders.
      if (order.userId !== user.id) {
        throw new AppError("Access denied", 403);
      }
      if (newStatus !== OrderStatus.CANCELLED) {
        throw new AppError("Customers can only cancel orders", 403);
      }
    } else if (user.role !== Roles.ADMIN) {
      throw new AppError("Access denied", 403);
    }

    const allowed = ORDER_STATUS_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new AppError(
        `Cannot change order status from "${order.status}" to "${newStatus}"`,
        409,
      );
    }

    order.status = newStatus;
    await order.save({ transaction });

    return Orders.findOne({
      where: { id: order.id },
      include: [{ model: OrderItems, as: "orderItems" }],
      transaction,
    });
  });

  // Top menu items are computed from delivered orders.
  if (newStatus === OrderStatus.DELIVERED) {
    await deleteCache(TOP_MENU_ITEMS_CACHE_KEY);
  }

  return updatedOrder;
}

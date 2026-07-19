import { MenuItems } from "./MenuItems.js";
import { OrderItems } from "./OrderItems.js";
import { Orders } from "./Orders.js";
import { Restaurant } from "./Restaurant.js";
import { User } from "./User.js";

// Associations
Restaurant.hasMany(MenuItems, {
  foreignKey: "restaurantId",
});

MenuItems.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
});

User.hasMany(Orders, {
  foreignKey: "userId",
  as: "orders",
});

Orders.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Restaurant -> Order
Restaurant.hasMany(Orders, {
  foreignKey: "restaurantId",
  as: "orders",
});

Orders.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  as: "restaurant",
});

// ==============================
// Order -> Order Items
// ==============================

Orders.hasMany(OrderItems, {
  foreignKey: "orderId",
  as: "orderItems",
  onDelete: "CASCADE",
});

OrderItems.belongsTo(Orders, {
  foreignKey: "orderId",
  as: "order",
});

// ==============================
// Menu Item -> Order Items
// ==============================

MenuItems.hasMany(OrderItems, {
  foreignKey: "menuItemId",
  as: "orderItems",
});

OrderItems.belongsTo(MenuItems, {
  foreignKey: "menuItemId",
  as: "menuItem",
});

export { User, Restaurant, MenuItems, Orders, OrderItems };

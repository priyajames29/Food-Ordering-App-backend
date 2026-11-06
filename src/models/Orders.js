import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { OrderStatus, ORDER_STATUS_VALUES } from "../constants/orderStatus.js";

export const Orders = sequelize.define("Orders", {
  status: {
    type: DataTypes.ENUM(...ORDER_STATUS_VALUES),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  },

  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  orderedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

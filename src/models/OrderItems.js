import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { Restaurant } from "./Restaurant.js";

export const OrderItems = sequelize.define("OrderItems", {
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

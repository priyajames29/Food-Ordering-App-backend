import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const OrderItems = sequelize.define("OrderItems", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

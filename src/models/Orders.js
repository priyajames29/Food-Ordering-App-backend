import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Orders = sequelize.define("Orders", {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  orderedAt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

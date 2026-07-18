import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

export const Restaurant = sequelize.define("Restaurant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  openingTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  closingTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

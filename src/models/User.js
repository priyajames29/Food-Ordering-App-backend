import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { Roles, ROLE_VALUES } from "../constants/roles.js";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },

  role: {
    type: DataTypes.ENUM(...ROLE_VALUES),
    allowNull: false,
    defaultValue: Roles.CUSTOMER,
  },
});

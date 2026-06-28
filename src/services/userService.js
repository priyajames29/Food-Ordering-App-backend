import { where } from "sequelize";
import { User } from "../models/User.js";

export async function getAllUsers() {
  return await User.findAll();
}

export async function createUser(data) {
  try {
    return await User.create(data);
  } catch (error) {
    throw error;
  }
}

export async function getUserFromId(params) {
  try {
    const data = await User.findOne({
      where: {
        id: params.id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

//Model.update(values, options)
export async function updateUserService(id, body) {
  try {
    return await User.update(body, {
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteUserService(id) {
  console.log("here", id);
  try {
    return User.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
}

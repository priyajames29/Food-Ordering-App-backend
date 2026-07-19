import { where } from "sequelize";
import { User } from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";

export async function getAllUsers() {
  return await User.findAll();
}

export async function createUser(data) {
  try {
    const hashedPassword = await hashPassword(data.password);
    return await User.create({
      ...data,
      password: hashedPassword,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function loginUserService(data) {
  try {
    console.log(data);
    const user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    const isMatch = await comparePassword(data.password, user.password);
    if (isMatch) {
      console.log("Access granted: Passwords match.");
    } else {
      console.log("Access denied: Invalid password.");
    }

    return isMatch;
  } catch (error) {
    throw new Error(error);
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
  console.log(body);
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

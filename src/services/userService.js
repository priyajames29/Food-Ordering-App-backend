import { where } from "sequelize";
import { User } from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

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
    const user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (isMatch) {
      console.log("Access granted: Passwords match.");
    } else {
      console.log("Access denied: Invalid password.");
    }

    const token = await generateAccessToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
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
    const hashedPassword = await hashPassword(body.password);
    return await User.update(
      {
        ...body,
        password: hashedPassword,
      },
      {
        where: {
          id: id,
        },
      },
    );
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

import { User } from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";

export async function getAllUsers() {
  return User.findAll();
}

export async function createUser(data) {
  const hashedPassword = await hashPassword(data.password);
  return User.create({
    ...data,
    password: hashedPassword,
  });
}

export async function loginUserService(data) {
  const user = await User.findOne({ where: { email: data.email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
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
}

export async function getUserFromId(params) {
  return User.findOne({ where: { id: params.id } });
}

export async function updateUserService(id, body) {
  const hashedPassword = await hashPassword(body.password);
  return User.update({ ...body, password: hashedPassword }, { where: { id } });
}

export async function deleteUserService(id) {
  return User.destroy({ where: { id } });
}

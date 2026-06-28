import {
  getAllUsers,
  createUser,
  getUserFromId,
  updateUserService,
  deleteUserService,
} from "../services/userService.js";
import { createUserSchema } from "../validators/userValidator.js";

export async function getUsers(req, res) {
  const users = await getAllUsers();
  console.log("get /users");

  res.json({ users });
}

export async function createUserController(req, res) {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createUser(validatedData);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getUserFromIdController(req, res) {
  try {
    const user = await getUserFromId(req.params);
    res.json({ user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await getUserFromId(req.params);
    let result;
    if (user) {
      await updateUserService(user.dataValues.id, req.body);
    } else {
      await createUser(createUserSchema.parse(req.body));
    }
    res.status(201).json({ message: "updated" });
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await getUserFromId(req.params);
    if (user) {
      await deleteUserService(req.params.id);
      res.status(201).json({ message: "deleted" });
    } else {
      res.status(201).json({ message: "user not found" });
    }
  } catch (error) {
    throw error;
  }
}

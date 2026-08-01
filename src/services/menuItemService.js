import { MenuItems } from "../models/MenuItems.js";

export async function createMenuItemService(data) {
  try {
    return await MenuItems.create({
      ...data,
    });
  } catch (error) {
    throw new Error(error);
  }
}

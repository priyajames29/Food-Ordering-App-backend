import {
  createMenuItemService,
  getMenuItemsRestaurantService,
  getMenuItemsService,
} from "../services/menuItemService.js";
import { createMenuItemSchema } from "../validators/menuItemsValidator.js";

export async function getMenuItems(req, res) {
  try {
    const allMenuItems = await getMenuItemsService();
    const menuItemResponse = allMenuItems.map((item) => ({
      name: item.dataValues?.name,
      description: item.dataValues?.description,
      isAvailable: item.dataValues?.isAvailable,
      price: item.dataValues?.price,
    }));
    res.json({ menuItemResponse });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getMenuItemsRestaurant(req, res) {
  try {
    console.log("controller");
    const menuItems = await getMenuItemsRestaurantService(req.params);
    res.json({ menuItems });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function createMenuItem(req, res) {
  try {
    const validatedData = createMenuItemSchema.parse(req.body);
    const menuItems = await createMenuItemService(validatedData);
    res.status(201).json(menuItems);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

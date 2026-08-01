import { createMenuItemService } from "../services/menuItemService.js";
import { createMenuItemSchema } from "../validators/menuItemsValidator.js";

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

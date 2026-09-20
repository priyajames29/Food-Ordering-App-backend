import { Restaurant } from "../models/Restaurant.js";

export async function checkRestaurantOwnership(req, res, next) {
  try {
    if (req.user.role === "admin") {
      return next();
    }

    const restaurant = await Restaurant.findOne({
      where: { id: req.params.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

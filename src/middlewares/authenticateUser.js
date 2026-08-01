import { verifyAccessToken } from "../utils/jwt.js";

export function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);
    console.log(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

import jwt from "jsonwebtoken";

export async function generateAccessToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return token;
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

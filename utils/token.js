import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_token";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

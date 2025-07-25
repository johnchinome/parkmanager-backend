import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecret";

export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

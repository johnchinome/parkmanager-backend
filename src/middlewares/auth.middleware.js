import { verifyToken } from "../utils/jwt.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // contiene: { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

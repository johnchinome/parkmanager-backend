import prisma from "../prisma/client.js";
import { comparePassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    const { cellphone, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { cellphone },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // 👈 Asegúrate de que aquí venga el `id` y `role`
    next();
  });
};

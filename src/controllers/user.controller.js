import prisma from "../prisma/client.js";
import { hashPassword } from "../utils/bcrypt.js";
import * as userService from "../services/user.service.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, cellphone, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { cellphone },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, cellphone, email, password: hashed },
    });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        cellphone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.role !== "ADMIN" && req.user.id !== userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const user = await userService.getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

export const updateOneUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.role !== "ADMIN" && req.user.id !== userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const data = { ...req.body };
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  try {
    const updated = await userService.updateUser(userId, data);
    res.json({ message: "User updated", updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteOneUser = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admin can delete users" });
  }

  const userId = parseInt(req.params.id);

  try {
    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployeeAudit = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const result = await service.getEmployeeAudit({
      userId,
      startDate,
      endDate,
    });
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en auditoría", error: error.message });
  }
};

export const getEmployeeAuditGrouped = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const result = await service.getEmployeeAuditGrouped({
      userId,
      startDate,
      endDate,
    });
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en auditoría agrupada", error: error.message });
  }
};

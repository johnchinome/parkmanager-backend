require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API ParkManager en funcionamiento 🚗");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.get("/ping-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ status: "ok", users });
  } catch (error) {
    res.status(500).json({ error: "No se pudo conectar a la base de datos" });
  }
});

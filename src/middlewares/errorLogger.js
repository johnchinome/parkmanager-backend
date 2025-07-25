import { prisma } from "../prisma/client.js";

export const errorLogger = async (err, req, res, next) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        action: "ERROR",
        entity: null,
        entityId: null,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: {
          message: err.message,
          stack: err.stack,
          route: req.originalUrl,
          method: req.method,
          body: req.body || null,
        },
      },
    });
  } catch (logErr) {
    console.error("❌ Error al registrar en auditLog:", logErr);
  }

  console.error("🔥 Error capturado:", err);
  res.status(500).json({ message: "Error interno del servidor." });
};

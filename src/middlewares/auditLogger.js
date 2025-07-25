import prisma from "../prisma/client.js";

export const auditLogger = async (req, res, next) => {
  res.on("finish", async () => {
    if (!req.user || res.statusCode >= 400) return;

    const loggableMethods = ["POST", "PUT", "PATCH", "DELETE"];
    if (!loggableMethods.includes(req.method)) return;

    const action = `${req.method} ${req.originalUrl}`;
    const entityMatch = req.originalUrl.match(/\/api\/(\w+)(?:\/(\d+))?/);

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: action,
        entity: entityMatch?.[1]?.toUpperCase(),
        entityId: entityMatch?.[2] ? parseInt(entityMatch[2]) : null,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: {
          body: req.body || null,
        },
      },
    });
  });

  next();
};

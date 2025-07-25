import prisma from "../prisma/client.js";

export const getAuditLogs = async (req, res) => {
  const { start, end, userId, entity } = req.query;

  const where = {
    ...(userId && { userId: parseInt(userId) }),
    ...(entity && { entity: entity.toUpperCase() }),
    ...(start &&
      end && {
        createdAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      }),
  };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  res.json(logs);
};

export const getMyAuditLogs = async (req, res) => {
  const userId = req.user.id;

  const { start, end, entity } = req.query;

  const where = {
    userId,
    ...(entity && { entity: entity.toUpperCase() }),
    ...(start &&
      end && {
        createdAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      }),
  };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  res.json(logs);
};

export const getErrorLogs = async (req, res) => {
  const { start, end, userId, route } = req.query;

  const where = {
    action: "ERROR",
    ...(userId && { userId: parseInt(userId) }),
    ...(route && {
      metadata: {
        path: ["route"],
        equals: route,
      },
    }),
    ...(start &&
      end && {
        createdAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      }),
  };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  res.json(logs);
};

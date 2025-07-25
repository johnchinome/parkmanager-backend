import prisma from "../prisma/client.js";

export const getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      cellphone: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      cellphone: true,
      role: true,
      createdAt: true,
    },
  });
};

export const updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const getEmployeeAudit = async ({ userId, startDate, endDate }) => {
  const filters = {
    registeredBy: parseInt(userId),
  };

  if (startDate || endDate) {
    filters.entryTime = {};
    if (startDate) filters.entryTime.gte = new Date(startDate);
    if (endDate) filters.entryTime.lte = new Date(endDate);
  }

  const entries = await prisma.entryExit.findMany({
    where: filters,
    select: {
      id: true,
      entryTime: true,
      exitTime: true,
      totalToPay: true,
    },
  });

  const totalEntries = entries.length;
  const totalExits = entries.filter((e) => e.exitTime).length;
  const totalCollected = entries.reduce(
    (sum, e) => sum + (e.totalToPay || 0),
    0
  );

  return {
    userId: parseInt(userId),
    period: {
      startDate: startDate || null,
      endDate: endDate || null,
    },
    totalEntries,
    totalExits,
    totalCollected: totalCollected.toFixed(2),
  };
};

export const getEmployeeAuditGrouped = async ({
  userId,
  startDate,
  endDate,
}) => {
  const filters = {
    registeredBy: parseInt(userId),
  };

  if (startDate || endDate) {
    filters.entryTime = {};
    if (startDate) filters.entryTime.gte = new Date(startDate);
    if (endDate) filters.entryTime.lte = new Date(endDate);
  }

  const entries = await prisma.entryExit.findMany({
    where: filters,
    include: {
      parkingLot: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
    },
  });

  // Agrupamos por fecha y parqueadero
  const grouped = {};

  for (const e of entries) {
    const dateKey = new Date(e.entryTime).toISOString().split("T")[0];
    const lotKey = e.parkingLot.id;
    const groupKey = `${dateKey}::${lotKey}`;

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        date: dateKey,
        parkingLot: e.parkingLot,
        totalEntries: 0,
        totalExits: 0,
        totalCollected: 0,
      };
    }

    grouped[groupKey].totalEntries += 1;
    if (e.exitTime) {
      grouped[groupKey].totalExits += 1;
      grouped[groupKey].totalCollected += e.totalToPay || 0;
    }
  }

  return Object.values(grouped).map((g) => ({
    ...g,
    totalCollected: g.totalCollected.toFixed(2),
  }));
};

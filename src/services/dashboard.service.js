import prisma from "../prisma/client.js";

export const getOccupancyDashboard = async (parkingLotId, days = 7) => {
  const lotId = parseInt(parkingLotId);

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - days);

  // 1. Ocupación actual
  const totalSpaces = await prisma.space.count({
    where: { parkingLotId: lotId },
  });
  const occupiedSpaces = await prisma.space.count({
    where: { parkingLotId: lotId, isOccupied: true },
  });

  // 2. Entradas/salidas de los últimos N días
  const entries = await prisma.entryExit.findMany({
    where: {
      parkingLotId: lotId,
      entryTime: { gte: startDate },
    },
    select: {
      entryTime: true,
      exitTime: true,
      vehicle: { select: { type: true } },
    },
  });

  const daysMap = {};
  let totalDurations = {}; // por tipo
  let countsByType = {};

  entries.forEach((e) => {
    const dateKey = new Date(e.entryTime).toISOString().split("T")[0];
    daysMap[dateKey] = (daysMap[dateKey] || 0) + 1;

    if (e.exitTime) {
      const duration =
        (new Date(e.exitTime) - new Date(e.entryTime)) / (1000 * 60); // en minutos
      const type = e.vehicle.type;
      totalDurations[type] = (totalDurations[type] || 0) + duration;
      countsByType[type] = (countsByType[type] || 0) + 1;
    }
  });

  const avgOccupationPerDay =
    Object.values(daysMap).reduce((a, b) => a + b, 0) / days;
  const avgDurations = Object.entries(totalDurations).map(([type, sum]) => ({
    type,
    averageDurationMinutes: (sum / countsByType[type]).toFixed(2),
  }));

  return {
    currentOccupation: {
      occupied: occupiedSpaces,
      total: totalSpaces,
      percentage: totalSpaces
        ? ((occupiedSpaces / totalSpaces) * 100).toFixed(2)
        : "0.00",
    },
    averageEntriesPerDay: avgOccupationPerDay.toFixed(2),
    averageDurationsByVehicleType: avgDurations,
  };
};

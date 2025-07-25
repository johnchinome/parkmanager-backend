import prisma from "../prisma/client.js";
import { differenceInMinutes } from "date-fns";

export const checkIn = async (vehicleId, parkingLotId, registeredBy) => {
  return prisma.entryExit.create({
    data: {
      vehicleId,
      parkingLotId,
      registeredBy,
    },
  });
};

export const checkOut = async (entryId, manualDiscount = 0) => {
  const entry = await prisma.entryExit.findUnique({
    where: { id: entryId },
    include: {
      vehicle: {
        include: { user: true },
      },
      parkingLot: {
        include: { rates: true },
      },
    },
  });

  const user = entry.vehicle.user;

  if (!entry || entry.exitTime) {
    throw new Error("Invalid or already processed entry");
  }

  const exitTime = new Date();
  const minutes = differenceInMinutes(exitTime, entry.entryTime);
  const hours = Math.ceil(minutes / 60);

  const rate = entry.parkingLot.rates.find(
    (r) => r.vehicleType === entry.vehicle.type
  );
  if (!rate) throw new Error("No rate defined for this vehicle type");

  let discount = manualDiscount;

  if (user) {
    const now = new Date();
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (activeSubscription) {
      discount = 1; // 100% de descuento
    }
  }

  const subtotal = hours * rate.pricePerHour;
  const total = subtotal * (1 - discount);

  const updated = await prisma.entryExit.update({
    where: { id: entryId },
    data: {
      exitTime,
      totalToPay: total,
      discount,
    },
    include: {
      vehicle: true,
    },
  });

  const duration = differenceInMinutes(exitTime, entry.entryTime);
  const hoursBilled = Math.ceil(duration / 60);

  return {
    comprobante: {
      id: updated.id,
      placa: entry.vehicle.plate,
      tipoVehiculo: entry.vehicle.type,
      propietario: entry.vehicle.user.name,
      parqueadero: entry.parkingLot.name,
      ubicacion: entry.parkingLot.location,
      entrada: entry.entryTime,
      salida: updated.exitTime,
      tiempoEstadiaMin: duration,
      horasFacturadas: hoursBilled,
      tarifaPorHora: rate.pricePerHour,
      descuentoAplicado: `${discount * 100}%`,
      totalPagar: updated.totalToPay,
    },
  };
};

export const listEntries = (parkingLotId) => {
  return prisma.entryExit.findMany({
    where: { parkingLotId },
    include: { vehicle: true },
    orderBy: { entryTime: "desc" },
  });
};

export const getEntriesByRegisteredUser = async (userId) => {
  return prisma.entryExit.findMany({
    where: {
      registeredBy: userId,
    },
    include: {
      vehicle: true,
      parkingLot: true,
    },
    orderBy: { entryTime: "desc" },
  });
};

export const getEntriesByParkingLotWithFilters = async ({
  parkingLotId,
  registeredBy,
  startDate,
  endDate,
}) => {
  const filters = {
    parkingLotId: parseInt(parkingLotId),
  };

  if (registeredBy) {
    filters.registeredBy = parseInt(registeredBy);
  }

  if (startDate || endDate) {
    filters.entryTime = {};
    if (startDate) filters.entryTime.gte = new Date(startDate);
    if (endDate) filters.entryTime.lte = new Date(endDate);
  }

  return prisma.entryExit.findMany({
    where: filters,
    include: {
      vehicle: {
        select: {
          plate: true,
          type: true,
          user: {
            select: { name: true, cellphone: true },
          },
        },
      },
      registeredByUser: {
        select: { id: true, name: true, role: true },
      },
    },
    orderBy: { entryTime: "desc" },
  });
};

export const getDailySummaryByParkingLot = async (parkingLotId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const entriesToday = await prisma.entryExit.findMany({
    where: {
      parkingLotId: parseInt(parkingLotId),
      entryTime: { gte: todayStart, lte: todayEnd },
    },
    select: { id: true },
  });

  const exitsToday = await prisma.entryExit.findMany({
    where: {
      parkingLotId: parseInt(parkingLotId),
      exitTime: { gte: todayStart, lte: todayEnd },
    },
    select: {
      id: true,
      totalToPay: true,
    },
  });

  const totalIncome = exitsToday.reduce(
    (sum, e) => sum + (e.totalToPay || 0),
    0
  );

  const occupiedSpaces = await prisma.space.count({
    where: {
      parkingLotId: parseInt(parkingLotId),
      isOccupied: true,
    },
  });

  const totalSpaces = await prisma.space.groupBy({
    by: ["type"],
    where: { parkingLotId: parseInt(parkingLotId) },
    _count: true,
  });

  return {
    date: todayStart.toISOString().split("T")[0],
    totalEntries: entriesToday.length,
    totalExits: exitsToday.length,
    totalIncome: totalIncome.toFixed(2),
    currentOccupiedSpaces: occupiedSpaces,
    spaceBreakdown: totalSpaces.map((s) => ({
      type: s.type,
      count: s._count,
    })),
  };
};

export const getReportByParkingLotAndDateRange = async ({
  parkingLotId,
  startDate,
  endDate,
}) => {
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date();

  const entries = await prisma.entryExit.findMany({
    where: {
      parkingLotId: parseInt(parkingLotId),
      entryTime: { gte: start, lte: end },
    },
    include: {
      exitTime: true,
      totalToPay: true,
    },
  });

  const totalEntries = entries.length;
  const totalExits = entries.filter((e) => e.exitTime).length;
  const totalIncome = entries.reduce((sum, e) => sum + (e.totalToPay || 0), 0);
  const avgIncomePerExit = totalExits
    ? (totalIncome / totalExits).toFixed(2)
    : "0.00";

  return {
    parkingLotId: parseInt(parkingLotId),
    period: {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    },
    totalEntries,
    totalExits,
    totalIncome: totalIncome.toFixed(2),
    avgIncomePerExit,
  };
};

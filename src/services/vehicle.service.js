import prisma from "../prisma/client.js";

export const getVehicleHistoryByPlate = async (plate, startDate, endDate) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { plate },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          cellphone: true,
        },
      },
      entries: {
        where: {
          AND: [
            startDate ? { entryTime: { gte: new Date(startDate) } } : {},
            endDate ? { entryTime: { lte: new Date(endDate) } } : {},
          ],
        },
        include: {
          parkingLot: {
            select: { id: true, name: true, location: true },
          },
          registeredByUser: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { entryTime: "desc" },
      },
    },
  });

  if (!vehicle) throw new Error("Vehículo no encontrado");

  return vehicle;
};

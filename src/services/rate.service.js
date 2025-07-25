import prisma from "../prisma/client.js";

export const createRate = (parkingLotId, vehicleType, pricePerHour) => {
  return prisma.rate.create({
    data: {
      parkingLotId,
      vehicleType,
      pricePerHour,
    },
  });
};

export const getRatesByParkingLot = (parkingLotId) => {
  return prisma.rate.findMany({
    where: { parkingLotId },
  });
};

export const updateRate = (id, data) => {
  return prisma.rate.update({
    where: { id },
    data,
  });
};

export const deleteRate = (id) => {
  return prisma.rate.delete({
    where: { id },
  });
};

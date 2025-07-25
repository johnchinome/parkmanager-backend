import prisma from "../prisma/client.js";

export const createSpace = (parkingLotId, type) => {
  return prisma.space.create({
    data: {
      parkingLotId,
      type,
    },
  });
};

export const getSpacesByParkingLot = (parkingLotId) => {
  return prisma.space.findMany({
    where: { parkingLotId },
  });
};

export const updateSpace = (id, data) => {
  return prisma.space.update({
    where: { id },
    data,
  });
};

export const deleteSpace = (id) => {
  return prisma.space.delete({
    where: { id },
  });
};

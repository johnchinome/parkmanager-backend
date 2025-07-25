import prisma from "../prisma/client.js";

export const createParkingLot = (data) => {
  return prisma.parkingLot.create({ data });
};

export const getParkingLotsByUser = (userId) => {
  return prisma.parkingLot.findMany({ where: { ownerId: userId } });
};

export const getParkingLotById = (id) => {
  return prisma.parkingLot.findUnique({ where: { id } });
};

export const updateParkingLot = (id, data) => {
  return prisma.parkingLot.update({ where: { id }, data });
};

export const deleteParkingLot = (id) => {
  return prisma.parkingLot.delete({ where: { id } });
};

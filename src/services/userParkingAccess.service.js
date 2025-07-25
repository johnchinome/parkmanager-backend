import prisma from "../prisma/client.js";

export const assignEmployee = async (userId, parkingLotId) => {
  return prisma.userParkingLotAccess.create({
    data: { userId, parkingLotId },
  });
};

export const getEmployeesByParkingLot = (parkingLotId) => {
  return prisma.userParkingLotAccess.findMany({
    where: { parkingLotId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          cellphone: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const removeAssignment = async (id) => {
  return prisma.userParkingLotAccess.delete({
    where: { id },
  });
};

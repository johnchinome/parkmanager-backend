import prisma from "../prisma/client.js";

export const validateEntryAccess = async (user, entryId) => {
  const entry = await prisma.entryExit.findUnique({
    where: { id: entryId },
    include: {
      parkingLot: {
        select: { id: true, ownerId: true },
      },
    },
  });

  if (!entry) throw new Error("Entrada no encontrada");

  const parkingLotId = entry.parkingLot.id;

  // ADMIN: acceso total
  if (user.role === "ADMIN") return true;

  // OWNER: solo si es el propietario del parqueadero
  if (user.role === "OWNER" && entry.parkingLot.ownerId === user.id)
    return true;

  // EMPLOYEE: solo si está asignado
  if (user.role === "EMPLOYEE") {
    const assigned = await prisma.userParkingLotAccess.findFirst({
      where: {
        userId: user.id,
        parkingLotId,
      },
    });
    if (assigned) return true;
  }

  return false;
};

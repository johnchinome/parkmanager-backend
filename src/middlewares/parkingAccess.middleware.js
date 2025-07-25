import prisma from "../prisma/client.js";

export const authorizeParkingAccess = () => {
  return async (req, res, next) => {
    const { role, id: userId } = req.user;
    const parkingLotId = parseInt(
      req.params.parkingLotId || req.body.parkingLotId
    );

    if (!parkingLotId) {
      return res.status(400).json({ message: "ParkingLotId is required" });
    }

    if (role === "ADMIN") {
      return next();
    }

    const parkingLot = await prisma.parkingLot.findUnique({
      where: { id: parkingLotId },
      select: { ownerId: true },
    });

    if (!parkingLot) {
      return res.status(404).json({ message: "Parking lot not found" });
    }

    if (role === "OWNER" && parkingLot.ownerId === userId) {
      return next();
    }

    if (role === "EMPLOYEE") {
      const assigned = await prisma.userParkingLotAccess.findFirst({
        where: {
          userId,
          parkingLotId,
        },
      });

      if (assigned) return next();
    }

    return res
      .status(403)
      .json({ message: "Access denied to this parking lot" });
  };
};

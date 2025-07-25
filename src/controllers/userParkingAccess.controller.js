import * as service from "../services/userParkingAccess.service.js";
import prisma from "../prisma/client.js";

export const assign = async (req, res) => {
  const { userId, parkingLotId } = req.body;
  const requestor = req.user;

  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parkingLotId },
  });

  if (!parkingLot)
    return res.status(404).json({ message: "Parking lot not found" });

  // Solo el owner del parqueadero o admin puede asignar
  if (requestor.role !== "ADMIN" && parkingLot.ownerId !== requestor.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const result = await service.assignEmployee(userId, parkingLotId);
  res.status(201).json({ message: "Employee assigned", result });
};

export const list = async (req, res) => {
  const { parkingLotId } = req.params;
  const requestor = req.user;

  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parseInt(parkingLotId) },
  });

  if (!parkingLot)
    return res.status(404).json({ message: "Parking lot not found" });

  if (requestor.role !== "ADMIN" && parkingLot.ownerId !== requestor.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const empleados = await service.getEmployeesByParkingLot(
    parseInt(parkingLotId)
  );
  res.json(empleados);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await service.removeAssignment(parseInt(id));
  res.json({ message: "Assignment removed" });
};

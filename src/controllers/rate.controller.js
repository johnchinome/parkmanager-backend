import * as service from "../services/rate.service.js";
import prisma from "../prisma/client.js";

export const create = async (req, res) => {
  const { parkingLotId } = req.params;
  const { vehicleType, pricePerHour } = req.body;

  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parseInt(parkingLotId) },
  });

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const existing = await prisma.rate.findFirst({
    where: {
      parkingLotId: parseInt(parkingLotId),
      vehicleType,
    },
  });

  if (existing) {
    return res
      .status(400)
      .json({ message: "Rate for this vehicle type already exists" });
  }

  const rate = await service.createRate(
    parseInt(parkingLotId),
    vehicleType,
    pricePerHour
  );
  res.status(201).json(rate);
};

export const list = async (req, res) => {
  const { parkingLotId } = req.params;

  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parseInt(parkingLotId) },
  });

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const rates = await service.getRatesByParkingLot(parseInt(parkingLotId));
  res.json(rates);
};

export const update = async (req, res) => {
  const { id } = req.params;

  const rate = await prisma.rate.findUnique({
    where: { id: parseInt(id) },
    include: { parkingLot: true },
  });

  if (!rate || rate.parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const updated = await service.updateRate(parseInt(id), req.body);
  res.json(updated);
};

export const remove = async (req, res) => {
  const { id } = req.params;

  const rate = await prisma.rate.findUnique({
    where: { id: parseInt(id) },
    include: { parkingLot: true },
  });

  if (!rate || rate.parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  await service.deleteRate(parseInt(id));
  res.json({ message: "Rate deleted" });
};

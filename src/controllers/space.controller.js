import * as service from "../services/space.service.js";
import prisma from "../prisma/client.js";

export const create = async (req, res) => {
  const { parkingLotId } = req.params;
  const { type } = req.body;

  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parseInt(parkingLotId) },
  });

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const space = await service.createSpace(parseInt(parkingLotId), type);
  res.status(201).json(space);
};

export const list = async (req, res) => {
  const { parkingLotId } = req.params;

  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parseInt(parkingLotId) },
  });

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const spaces = await service.getSpacesByParkingLot(parseInt(parkingLotId));
  res.json(spaces);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const space = await prisma.space.findUnique({
    where: { id: parseInt(id) },
    include: { parkingLot: true },
  });

  if (!space || space.parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const updated = await service.updateSpace(parseInt(id), req.body);
  res.json(updated);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const space = await prisma.space.findUnique({
    where: { id: parseInt(id) },
    include: { parkingLot: true },
  });

  if (!space || space.parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  await service.deleteSpace(parseInt(id));
  res.json({ message: "Space deleted" });
};

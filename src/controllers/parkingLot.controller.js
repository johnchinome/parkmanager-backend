import * as service from "../services/parkingLot.service.js";

export const create = async (req, res) => {
  const { name, location } = req.body;
  const ownerId = req.user.id;

  try {
    const parkingLot = await service.createParkingLot({
      name,
      location,
      ownerId,
    });
    res.status(201).json(parkingLot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllByUser = async (req, res) => {
  const parkingLots = await service.getParkingLotsByUser(req.user.id);
  res.json(parkingLots);
};

export const getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  const parkingLot = await service.getParkingLotById(id);

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(parkingLot);
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  const parkingLot = await service.getParkingLotById(id);

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const updated = await service.updateParkingLot(id, req.body);
  res.json(updated);
};

export const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  const parkingLot = await service.getParkingLotById(id);

  if (!parkingLot || parkingLot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  await service.deleteParkingLot(id);
  res.json({ message: "Parking lot deleted" });
};

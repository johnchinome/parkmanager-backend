import * as service from "../services/vehicle.service.js";

export const getHistory = async (req, res) => {
  const { plate } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const vehicle = await service.getVehicleHistoryByPlate(
      plate,
      startDate,
      endDate
    );
    res.json(vehicle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

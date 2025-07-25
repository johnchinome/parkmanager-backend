import * as service from "../services/dashboard.service.js";

export const getOccupancyDashboard = async (req, res) => {
  const { parkingLotId } = req.params;
  const { days } = req.query;

  try {
    const result = await service.getOccupancyDashboard(
      parkingLotId,
      parseInt(days) || 7
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar dashboard de ocupación",
      error: error.message,
    });
  }
};

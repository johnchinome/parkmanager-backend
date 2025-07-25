import * as service from "../services/entry.service.js";
import { validateEntryAccess } from "../utils/validateEntryAccess.js";

export const checkIn = async (req, res) => {
  try {
    const { parkingLotId, plate, type, ownerName } = req.body;

    const result = await service.checkIn(vehicle.id, parkingLotId, req.user.id);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { discount } = req.body;
    const entryId = parseInt(req.params.entryId);

    const hasAccess = await validateEntryAccess(req.user, entryId);
    if (!hasAccess)
      return res
        .status(403)
        .json({ message: "Acceso denegado al registro de entrada" });

    const result = await service.checkOut(entryId, discount);
    res.json(result.comprobante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const list = async (req, res) => {
  try {
    const { parkingLotId } = req.query;
    const entries = await service.listEntries(parseInt(parkingLotId));
    res.json(entries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const entries = await service.getEntriesByRegisteredUser(userId);
  res.json(entries);
};

export const listByParkingLotWithFilters = async (req, res) => {
  const { parkingLotId } = req.params;
  const { registeredBy, startDate, endDate } = req.query;

  try {
    const entries = await getEntriesByParkingLotWithFilters({
      parkingLotId,
      registeredBy,
      startDate,
      endDate,
    });

    res.json(entries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener registros", error: error.message });
  }
};

export const getDailySummary = async (req, res) => {
  const parkingLotId = req.params.parkingLotId;

  try {
    const summary = await service.getDailySummaryByParkingLot(parkingLotId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el resumen del día",
      error: error.message,
    });
  }
};

export const getReportByDateRange = async (req, res) => {
  const { parkingLotId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const report = await service.getReportByParkingLotAndDateRange({
      parkingLotId,
      startDate,
      endDate,
    });
    res.json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al generar el reporte", error: error.message });
  }
};

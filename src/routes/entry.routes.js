import express from "express";
import * as ctrl from "../controllers/entry.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authorizeParkingAccess } from "../middlewares/parkingAccess.middleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles("ADMIN", "EMPLOYEE"));

router.post("/entries/checkin", authorizeParkingAccess(), ctrl.checkIn);
router.post("/entries/checkout/:entryId", ctrl.checkOut);
router.get("/entries", ctrl.list);
router.get(
  "/entries/registered-by/:userId",
  authorizeRoles("ADMIN", "OWNER"),
  ctrl.listByUser
);
router.get(
  "/entries/parking/:parkingLotId",
  authorizeRoles("ADMIN", "OWNER"),
  authorizeParkingAccess(),
  ctrl.listByParkingLotWithFilters
);
router.get(
  "/entries/parking/:parkingLotId/summary",
  authorizeRoles("ADMIN", "OWNER", "EMPLOYEE"),
  authorizeParkingAccess(),
  ctrl.getDailySummary
);
router.get(
  "/entries/parking/:parkingLotId/report",
  authorizeRoles("ADMIN", "OWNER"),
  authorizeParkingAccess(),
  ctrl.getReportByDateRange
);

export default router;

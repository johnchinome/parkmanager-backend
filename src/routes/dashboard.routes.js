import express from "express";
import * as ctrl from "../controllers/dashboard.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authorizeParkingAccess } from "../middlewares/parkingAccess.middleware.js";

const router = express.Router();

router.get(
  "/dashboard/parking/:parkingLotId/occupancy",
  authenticateToken,
  authorizeRoles("ADMIN", "OWNER"),
  authorizeParkingAccess(),
  ctrl.getOccupancyDashboard
);

export default router;

import express from "express";
import * as ctrl from "../controllers/vehicle.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/:plate/history",
  authenticateToken,
  authorizeRoles("ADMIN", "OWNER", "EMPLOYEE"),
  ctrl.getHistory
);

export default router;

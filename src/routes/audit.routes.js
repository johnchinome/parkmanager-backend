import express from "express";
import * as ctrl from "../controllers/audit.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("ADMIN"), ctrl.getAuditLogs);
router.get("/me", authenticateToken, ctrl.getMyAuditLogs);
router.get(
  "/errors",
  authenticateToken,
  authorizeRoles("ADMIN"),
  ctrl.getErrorLogs
);

export default router;

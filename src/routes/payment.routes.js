import express from "express";
import * as ctrl from "../controllers/payment.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/payments/initiate",
  authenticateToken,
  authorizeRoles("OWNER"),
  ctrl.initiatePayment
);
router.get(
  "/payments/history",
  authenticateToken,
  authorizeRoles("OWNER"),
  ctrl.getPaymentHistory
);

export default router;

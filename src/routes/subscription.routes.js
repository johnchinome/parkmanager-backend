import express from "express";
import * as ctrl from "../controllers/subscription.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/subscriptions", authorizeRoles("ADMIN"), ctrl.create);
router.get("/subscriptions", authorizeRoles("ADMIN"), ctrl.list);
router.get("/subscriptions/:id", ctrl.getByUser);
router.delete("/subscriptions/:id", authorizeRoles("ADMIN"), ctrl.remove);
router.get(
  "/subscriptions/me",
  authenticateToken,
  authorizeRoles("OWNER"),
  ctrl.getMySubscription
);
router.get(
  "/subscriptions/all",
  authorizeRoles("ADMIN"),
  ctrl.getAllSubscriptions
);
router.post(
  "/subscriptions/renew",
  authenticateToken,
  authorizeRoles("OWNER", "ADMIN"),
  ctrl.renewSubscription
);

export default router;

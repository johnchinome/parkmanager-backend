import express from "express";
import * as ctrl from "../controllers/rate.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authorizeParkingAccess } from "../middlewares/parkingAccess.middleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles("ADMIN"));

router.post(
  "/parking-lots/:parkingLotId/rates",
  authorizeParkingAccess(),
  ctrl.create
);
router.get(
  "/parking-lots/:parkingLotId/rates",
  authorizeParkingAccess(),
  ctrl.list
);
router.put("/rates/:id", ctrl.update);
router.delete("/rates/:id", ctrl.remove);

export default router;

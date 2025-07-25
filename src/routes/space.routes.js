import express from "express";
import * as ctrl from "../controllers/space.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authorizeParkingAccess } from "../middlewares/parkingAccess.middleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles("ADMIN"));

router.post(
  "/parking-lots/:parkingLotId/spaces",
  authorizeParkingAccess(),
  ctrl.create
);
router.get(
  "/parking-lots/:parkingLotId/spaces",
  authorizeParkingAccess(),
  ctrl.list
);
router.put("/spaces/:id", ctrl.update);
router.delete("/spaces/:id", ctrl.remove);

export default router;

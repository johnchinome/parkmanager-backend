import express from "express";
import * as ctrl from "../controllers/userParkingAccess.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles("ADMIN", "OWNER"));

router.post("/assignments", ctrl.assign);
router.get("/assignments/:parkingLotId", ctrl.list);
router.delete("/assignments/:id", ctrl.remove);

export default router;

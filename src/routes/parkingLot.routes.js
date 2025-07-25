import express from "express";
import * as ctrl from "../controllers/parkingLot.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles("ADMIN"));

router.post("/", ctrl.create);
router.get("/", ctrl.getAllByUser);
router.get("/:id", ctrl.getOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;

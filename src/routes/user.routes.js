import express from "express";
import * as ctrl from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/user.validation.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), ctrl.createUser);
router.get("/me", authenticateToken, ctrl.getProfile);
router.get("/", authenticateToken, authorizeRoles("ADMIN"), ctrl.listUsers);
router.get("/:id", authenticateToken, ctrl.getOneUser);
router.put("/:id", authenticateToken, ctrl.updateOneUser);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  ctrl.deleteOneUser
);
router.get(
  "/employees/:userId/audit",
  authenticateToken,
  authorizeRoles("ADMIN", "OWNER"),
  ctrl.getEmployeeAudit
);
router.get(
  "/employees/:userId/audit/grouped",
  authenticateToken,
  authorizeRoles("ADMIN", "OWNER"),
  ctrl.getEmployeeAuditGrouped
);

export default router;

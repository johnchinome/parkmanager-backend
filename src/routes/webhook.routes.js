import express from "express";
import * as ctrl from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/webhook/wompi", express.json(), ctrl.handleWebhook);

export default router;

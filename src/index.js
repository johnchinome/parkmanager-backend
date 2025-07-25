import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import parkingLotRoutes from "./routes/parkingLot.routes.js";
import spaceRoutes from "./routes/space.routes.js";
import rateRoutes from "./routes/rate.routes.js";
import entryRoutes from "./routes/entry.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import userParkingAccessRoutes from "./routes/userParkingAccess.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { auditLogger } from "./middlewares/auditLogger.js";
import auditRoutes from "./routes/audit.routes.js";
import { errorLogger } from "./middlewares/errorLogger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(auditLogger);
app.use("/api/audits", auditRoutes);

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/parking-lots", parkingLotRoutes);
app.use("/api", spaceRoutes);
app.use("/api", rateRoutes);
app.use("/api", entryRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", userParkingAccessRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorLogger);

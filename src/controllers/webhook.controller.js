import crypto from "crypto";
import { prisma } from "../prisma.js";

export const handleWebhook = async (req, res) => {
  const receivedSignature = req.headers["x-signature"];
  const payload = JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  if (receivedSignature !== expected) {
    return res.status(401).json({ message: "Firma inválida" });
  }

  const event = req.body.event;
  const data = req.body.data;

  if (event === "transaction.updated") {
    const ref = data.reference;
    const [_, userId] = ref.split("-");
    const status = data.status.toUpperCase();

    // Actualizar estado de la orden
    await prisma.paymentOrder.updateMany({
      where: { reference: ref },
      data: {
        status:
          status === "APPROVED"
            ? "APPROVED"
            : status === "DECLINED"
            ? "DECLINED"
            : "FAILED",
      },
    });

    if (status === "APPROVED") {
      // Crear suscripción si no existe
      const now = new Date();
      const end = new Date();
      end.setMonth(now.getMonth() + 1); // mensual por ahora

      await prisma.subscription.create({
        data: {
          userId: parseInt(userId),
          type: "MONTHLY",
          startDate: now,
          endDate: end,
        },
      });
    }
  }

  res.status(200).send("OK");
};

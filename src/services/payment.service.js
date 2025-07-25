import { prisma } from "../prisma.js";

export const initiateWompiPayment = async (userId, subscriptionType) => {
  const ref = `subs-${userId}-${Date.now()}`;
  const amountByType = {
    MONTHLY: 10000,
    QUARTERLY: 27000,
    SEMIANNUAL: 50000,
    ANNUAL: 90000,
  };

  const amount = amountByType[subscriptionType];
  if (!amount) throw new Error("Tipo de suscripción inválido");

  // Registrar orden en base de datos
  await prisma.paymentOrder.create({
    data: {
      userId,
      reference: ref,
      subscriptionType,
      amount,
      status: "PENDING",
    },
  });

  // Generar link de pago en Wompi (simulado)
  const paymentUrl = `https://sandbox.wompi.co/payment?ref=${ref}`;

  return {
    paymentUrl,
    reference: ref,
  };
};

export const getPaymentHistory = async (userId) => {
  const orders = await prisma.paymentOrder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reference: true,
      subscriptionType: true,
      amount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return orders;
};

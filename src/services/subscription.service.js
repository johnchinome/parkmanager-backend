import prisma from "../prisma/client.js";
import { addMonths } from "date-fns";
import { getSubscriptionStatus } from "../utils/subscriptionStatus.js";

export const createSubscription = async (userId, type) => {
  const now = new Date();
  let months = 1;

  switch (type) {
    case "QUARTERLY":
      months = 3;
      break;
    case "SEMIANNUAL":
      months = 6;
      break;
    case "ANNUAL":
      months = 12;
      break;
  }

  const endDate = addMonths(now, months);

  return prisma.subscription.create({
    data: {
      userId,
      type,
      startDate: now,
      endDate,
    },
  });
};

export const listSubscriptions = () => {
  return prisma.subscription.findMany({ include: { user: true } });
};

export const getByUser = (id) => {
  return prisma.subscription.findMany({ where: { userId: id } });
};

export const deleteSubscription = (id) => {
  return prisma.subscription.delete({ where: { id } });
};

export const getCurrentSubscription = async (userId) => {
  const subs = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { endDate: "desc" },
    take: 1,
  });

  if (!subs.length) return null;

  const s = subs[0];
  return {
    ...s,
    status: getSubscriptionStatus(s.startDate, s.endDate),
  };
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      include: {
        user: {
          select: { id: true, name: true, cellphone: true, email: true },
        },
      },
      orderBy: { endDate: "desc" },
    });

    const result = subs.map((s) => ({
      ...s,
      status: getSubscriptionStatus(s.startDate, s.endDate),
    }));

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al listar suscripciones", error: error.message });
  }
};

export const renewSubscription = async (req, res) => {
  const userId = req.user.id;
  const { type } = req.body;

  const now = new Date();
  const end = new Date();
  switch (type) {
    case "MONTHLY":
      end.setMonth(now.getMonth() + 1);
      break;
    case "QUARTERLY":
      end.setMonth(now.getMonth() + 3);
      break;
    case "SEMIANNUAL":
      end.setMonth(now.getMonth() + 6);
      break;
    case "ANNUAL":
      end.setFullYear(now.getFullYear() + 1);
      break;
    default:
      return res.status(400).json({ message: "Tipo inválido" });
  }

  const newSub = await prisma.subscription.create({
    data: {
      userId,
      type,
      startDate: now,
      endDate: end,
    },
  });

  res.json({ message: "Renovada exitosamente", subscription: newSub });
};

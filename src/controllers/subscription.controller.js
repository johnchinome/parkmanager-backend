import * as service from "../services/subscription.service.js";

export const create = async (req, res) => {
  const { userId, type } = req.body;

  try {
    const result = await service.createSubscription(userId, type);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const list = async (req, res) => {
  const subscriptions = await service.listSubscriptions();
  res.json(subscriptions);
};

export const getByUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const isOwner = req.user.id === id;
  const isAdmin = req.user.role === "ADMIN";

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: "Access denied" });
  }

  const subs = await service.getByUser(id);
  res.json(subs);
};

export const remove = async (req, res) => {
  try {
    await service.deleteSubscription(parseInt(req.params.id));
    res.json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMySubscription = async (req, res) => {
  const userId = req.user.id;

  try {
    const subscription = await service.getCurrentSubscription(userId);
    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await service.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subscriptions", error: error.message });
  }
};

export const renewSubscription = async (req, res) => {
  const { userId, type } = req.body;

  try {
    const result = await service.renewSubscription(userId, type);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

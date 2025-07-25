export const getSubscriptionStatus = (startDate, endDate) => {
  const now = new Date();
  const expires = new Date(endDate);
  const diff = (expires - now) / (1000 * 60 * 60 * 24); // días

  if (now > expires) return "EXPIRED";
  if (diff <= 3) return "EXPIRING_SOON";
  return "ACTIVE";
};

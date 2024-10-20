export const getLastFriday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceFriday = (dayOfWeek + 2) % 7;
  const lastFriday = new Date(today.setDate(today.getDate() - daysSinceFriday));
  lastFriday.setHours(0, 0, 0, 0);
  return lastFriday;
};

export const filterPurchasesFromLastFriday = (purchases) => {
  const lastFriday = getLastFriday();
  return purchases.filter(purchase => new Date(purchase.itemBoughtDate) >= lastFriday);
};

export const filterDistrubutionsFromLastFriday = (distributions) => {
  const lastFriday = getLastFriday();
  return distributions.filter(distribution => new Date(distribution.itemUseDate) >= lastFriday);
};

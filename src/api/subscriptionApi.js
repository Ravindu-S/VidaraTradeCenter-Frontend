import API from "./axios";

/** Public: subscription eligibility + discounted unit price for a product */
export const getSubscriptionOfferForProduct = (productId) => {
  return API.get(`/subscription-offers/products/${productId}`);
};

export const getMySubscriptions = () => {
  return API.get("/subscriptions/mine");
};

export const createSubscription = (body) => {
  return API.post("/subscriptions", body);
};

export const updateSubscriptionFrequency = (subscriptionId, frequency) => {
  return API.patch(`/subscriptions/${subscriptionId}/frequency`, { frequency });
};

export const cancelSubscription = (subscriptionId) => {
  return API.post(`/subscriptions/${subscriptionId}/cancel`);
};

/** Admin */
export const getAdminSubscriptions = (params = {}) => {
  return API.get("/admin/subscriptions", { params });
};

export const getAdminSubscriptionOffers = (params = {}) => {
  return API.get("/admin/subscription-offers", { params });
};

export const upsertAdminSubscriptionOffer = (productId, body) => {
  return API.put(`/admin/subscription-offers/products/${productId}`, body);
};

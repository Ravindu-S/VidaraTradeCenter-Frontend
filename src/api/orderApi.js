import API from "./axios";

export const getOrderByNumber = (orderNumber) => {
  return API.get(`/orders/${orderNumber}`);
};

export const getDeliveryStatus = (orderNumber) => {
  return API.get(`/orders/${orderNumber}/delivery-status`);
};

export const getMyOrders = (page = 0, size = 10) => {
  return API.get(`/orders`, { params: { page, size } });
};

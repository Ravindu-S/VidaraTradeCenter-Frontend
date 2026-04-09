import API from "./axios";

// ===== CUSTOMER ORDER ENDPOINTS =====

// GET /api/orders - Get customer's orders
export const getMyOrders = (page = 0, size = 10) => {
  return API.get("/orders", { params: { page, size } });
};

// GET /api/orders/:orderNumber - Get single order
export const getOrderByNumber = (orderNumber) => {
  return API.get(`/orders/${orderNumber}`);
};

// GET /api/orders/:orderNumber/delivery-status - Get delivery status
export const getDeliveryStatus = (orderNumber) => {
  return API.get(`/orders/${orderNumber}/delivery-status`);
};

// GET /api/orders/id/:orderId/delivery-status - Get delivery status by ID
export const getDeliveryStatusById = (orderId) => {
  return API.get(`/orders/id/${orderId}/delivery-status`);
};

// GET /api/orders/my-deliveries - Get all user's deliveries
export const getMyDeliveries = () => {
  return API.get("/orders/my-deliveries");
};
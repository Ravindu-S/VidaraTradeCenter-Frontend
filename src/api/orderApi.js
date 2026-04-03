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


// ===== ADMIN ORDER ENDPOINTS =====

// GET /api/admin/orders - Get all orders (admin)
export const getAdminOrders = (params = {}) => {
  return API.get("/admin/orders", { params });
};

// GET /api/admin/orders/:id - Get order by ID (admin)
export const getAdminOrderById = (orderId) => {
  return API.get(`/admin/orders/${orderId}`);
};

// PUT /api/admin/orders/:id/status - Update order status (admin)
export const updateOrderStatus = (orderId, newStatus) => {
  return API.put(`/admin/orders/${orderId}/status`, { newStatus });
};

// GET /api/admin/orders/statistics - Get order statistics
export const getOrderStatistics = () => {
  return API.get("/admin/orders/statistics");
};


// ===== ADMIN REFUND ENDPOINTS =====

// POST /api/admin/orders/:id/refund - Process refund
export const processRefund = (orderId, refundData) => {
  return API.post(`/admin/orders/${orderId}/refund`, refundData);
};


// ===== ADMIN DELIVERY TRACKING ENDPOINTS =====

// POST /api/admin/orders/:id/delivery-tracking - Create delivery tracking
export const createDeliveryTracking = (orderId, trackingData) => {
  const params = new URLSearchParams();
  if (trackingData.trackingNumber) params.append("trackingNumber", trackingData.trackingNumber);
  if (trackingData.courierName) params.append("courierName", trackingData.courierName);
  if (trackingData.estimatedDeliveryDate) params.append("estimatedDeliveryDate", trackingData.estimatedDeliveryDate);
  
  return API.post(`/admin/orders/${orderId}/delivery-tracking?${params.toString()}`);
};

// PUT /api/admin/orders/:id/delivery-status - Update delivery status
export const updateDeliveryStatus = (orderId, status, notes = "") => {
  const params = new URLSearchParams({ status });
  if (notes) params.append("notes", notes);
  
  return API.put(`/admin/orders/${orderId}/delivery-status?${params.toString()}`);
};

// PUT /api/admin/orders/:id/tracking-info - Update tracking info
export const updateTrackingInfo = (orderId, trackingData) => {
  const params = new URLSearchParams();
  if (trackingData.trackingNumber) params.append("trackingNumber", trackingData.trackingNumber);
  if (trackingData.courierName) params.append("courierName", trackingData.courierName);
  if (trackingData.estimatedDeliveryDate) params.append("estimatedDeliveryDate", trackingData.estimatedDeliveryDate);
  
  return API.put(`/admin/orders/${orderId}/tracking-info?${params.toString()}`);
};

// GET /api/admin/orders/:id/delivery-tracking - Get delivery tracking
export const getAdminDeliveryTracking = (orderId) => {
  return API.get(`/admin/orders/${orderId}/delivery-tracking`);
};

// GET /api/admin/orders/deliveries/overdue - Get overdue deliveries
export const getOverdueDeliveries = () => {
  return API.get("/admin/orders/deliveries/overdue");
};

// GET /api/admin/orders/deliveries/status/:status - Get deliveries by status
export const getDeliveriesByStatus = (status) => {
  return API.get(`/admin/orders/deliveries/status/${status}`);
};
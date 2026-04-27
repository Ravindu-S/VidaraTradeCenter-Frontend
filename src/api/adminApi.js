import API from "./axios";
// ==================== DASHBOARD ====================
// GET /api/admin/dashboard/stats
export const getDashboardStats = () => {
  return API.get("/admin/dashboard/stats");
};
// GET /api/admin/inventory/low-stock
export const getLowStockProducts = () => {
  return API.get("/admin/inventory/low-stock");
};
// GET /api/admin/inventory/out-of-stock
export const getOutOfStockProducts = () => {
  return API.get("/admin/inventory/out-of-stock");
};
// ==================== USERS ====================
// GET /api/admin/users
export const getAdminUsers = (params = {}) => {
  return API.get("/admin/users", { params });
};
// PUT /api/admin/users/:id/status?status=ACTIVE
export const updateUserStatus = (id, status) => {
  return API.put(`/admin/users/${id}/status`, null, { params: { status } });
};
// DELETE /api/admin/users/:id
export const deleteAdminUser = (id) => {
  return API.delete(`/admin/users/${id}`);
};
// ==================== PRODUCTS ====================
// GET /api/admin/products
export const getAdminProducts = (params = {}) => {
  return API.get("/admin/products", { params });
};
// GET /api/admin/products/:id
export const getAdminProduct = (id) => {
  return API.get(`/admin/products/${id}`);
};
// GET /api/admin/products/form-data
export const getProductFormData = () => {
  return API.get("/admin/products/form-data");
};
// POST /api/admin/products
export const createAdminProduct = (data) => {
  return API.post("/admin/products", data);
};
// PUT /api/admin/products/:id
export const updateAdminProduct = (id, data) => {
  return API.put(`/admin/products/${id}`, data);
};
// DELETE /api/admin/products/:id
export const deleteAdminProduct = (id) => {
  return API.delete(`/admin/products/${id}`);
};
// ==================== CATEGORIES ====================
export const getAdminCategories = () => API.get("/categories");
export const getAdminCategory = (id) => API.get(`/categories/${id}`);
export const createAdminCategory = (data) => API.post("/categories", data);
export const updateAdminCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteAdminCategory = (id) => API.delete(`/categories/${id}`);
// ==================== BRANDS ====================
export const getAdminBrands = () => API.get("/brands");
export const getAdminBrand = (id) => API.get(`/brands/${id}`);
export const createAdminBrand = (data) => API.post("/brands", data);
export const updateAdminBrand = (id, data) => API.put(`/brands/${id}`, data);
export const deleteAdminBrand = (id) => API.delete(`/brands/${id}`);
// ==================== ORDERS ====================
export const getAdminOrders = (params = {}) => {
  return API.get("/admin/orders", { params });
};
export const getAdminOrderStats = () => {
  return API.get("/admin/orders/statistics");
};
export const getAdminOrderById = (id) => {
  return API.get(`/admin/orders/${id}`);
};
export const updateAdminOrderStatus = (id, newStatus) => {
  return API.put(`/admin/orders/${id}/status`, { newStatus });
};

// POST /api/admin/orders/:id/refund - Process refund
export const processRefund = (orderId, refundData) => {
  return API.post(`/admin/orders/${orderId}/refund`, refundData);
};

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

import API from "./axios";
// ==================== DASHBOARD ====================
// GET /api/admin/dashboard/stats
export const getDashboardStats = () => {
  return API.get("/admin/dashboard/stats");
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

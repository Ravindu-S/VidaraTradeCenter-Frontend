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

// GET /api/admin/products/form-data (categories + brands for dropdowns)
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

// GET /api/categories
export const getAdminCategories = () => {
  return API.get("/categories");
};

// GET /api/categories/:id
export const getAdminCategory = (id) => {
  return API.get(`/categories/${id}`);
};

// POST /api/categories
export const createAdminCategory = (data) => {
  return API.post("/categories", data);
};

// PUT /api/categories/:id
export const updateAdminCategory = (id, data) => {
  return API.put(`/categories/${id}`, data);
};

// DELETE /api/categories/:id
export const deleteAdminCategory = (id) => {
  return API.delete(`/categories/${id}`);
};

// ==================== BRANDS ====================

// GET /api/brands
export const getAdminBrands = () => {
  return API.get("/brands");
};

// GET /api/brands/:id
export const getAdminBrand = (id) => {
  return API.get(`/brands/${id}`);
};

// POST /api/brands
export const createAdminBrand = (data) => {
  return API.post("/brands", data);
};

// PUT /api/brands/:id
export const updateAdminBrand = (id, data) => {
  return API.put(`/brands/${id}`, data);
};

// DELETE /api/brands/:id
export const deleteAdminBrand = (id) => {
  return API.delete(`/brands/${id}`);
};

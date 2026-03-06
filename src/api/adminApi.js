import API from "./axios";

// GET /api/admin/dashboard/stats
export const getDashboardStats = () => {
  return API.get("/admin/dashboard/stats");
};

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

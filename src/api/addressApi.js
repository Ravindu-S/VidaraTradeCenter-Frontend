import API from "./axios";

// GET /api/users/addresses
export const getAddresses = () => {
  return API.get("/users/addresses");
};

// POST /api/users/addresses
export const addAddress = (data) => {
  return API.post("/users/addresses", data);
};

// PUT /api/users/addresses/:id
export const updateAddress = (id, data) => {
  return API.put(`/users/addresses/${id}`, data);
};

// DELETE /api/users/addresses/:id
export const deleteAddress = (id) => {
  return API.delete(`/users/addresses/${id}`);
};

// PUT /api/users/addresses/:id/default
export const setDefaultAddress = (id) => {
  return API.put(`/users/addresses/${id}/default`);
};

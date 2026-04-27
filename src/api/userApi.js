import API from "./axios";

// GET /api/users/profile
export const getProfile = () => {
  return API.get("/users/profile");
};

// PUT /api/users/profile
export const updateProfile = (data) => {
  return API.put("/users/profile", data);
};

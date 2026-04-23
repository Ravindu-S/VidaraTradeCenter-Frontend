import API from "./axios";

export const getMembershipPlans = () => API.get("/membership/plans");

export const getMembershipMe = () => API.get("/membership/me");

export const createMembershipCheckout = (body) => API.post("/membership/checkout", body);

/** Sandbox only — activates membership when PayHere notify_url cannot reach localhost. */
export const reconcileSandboxMembership = (body) => API.post("/membership/reconcile-sandbox", body);

export const cancelMembership = () => API.post("/membership/cancel");

export const getAdminMemberships = (params = {}) =>
  API.get("/admin/memberships", { params });

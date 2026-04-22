import API from "./axios";

// GET /api/admin/support/tickets - Get all tickets (paginated, optional status filter)
export const getAdminTickets = (page = 0, size = 10, status = null) => {
  const params = { page, size };
  if (status) params.status = status;
  return API.get("/admin/support/tickets", { params });
};

// GET /api/admin/support/tickets/:id - Get full ticket detail
export const getAdminTicketDetail = (ticketId) => {
  return API.get(`/admin/support/tickets/${ticketId}`);
};

// PUT /api/admin/support/tickets/:id/status - Update ticket status
export const updateTicketStatus = (ticketId, statusData) => {
  return API.put(`/admin/support/tickets/${ticketId}/status`, statusData);
};

// POST /api/admin/support/tickets/:id/reply - Add admin reply
export const addAdminReply = (ticketId, messageData) => {
  return API.post(`/admin/support/tickets/${ticketId}/reply`, messageData);
};

// GET /api/admin/support/stats - Get ticket statistics
export const getTicketStats = () => {
  return API.get("/admin/support/stats");
};

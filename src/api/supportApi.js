import API from "./axios";

// POST /api/support/tickets - Submit a support ticket
export const submitSupportTicket = (ticketData) => {
  return API.post("/support/tickets", ticketData);
};

// GET /api/support/tickets - Get all tickets for authenticated user
export const getMyTickets = () => {
  return API.get("/support/tickets");
};

// GET /api/support/tickets/:id - Get single ticket by ID
export const getTicketById = (ticketId) => {
  return API.get(`/support/tickets/${ticketId}`);
};

// POST /api/support/tickets/:id/messages - Add message to a ticket
export const addTicketMessage = (ticketId, messageData) => {
  return API.post(`/support/tickets/${ticketId}/messages`, messageData);
};

// PUT /api/support/tickets/:id/close - Close a ticket
export const closeTicket = (ticketId) => {
  return API.put(`/support/tickets/${ticketId}/close`);
};

import API from "./axios";

// POST /api/support/tickets - Submit a support ticket
export const submitSupportTicket = (ticketData) => {
  return API.post("/support/tickets", ticketData);
};

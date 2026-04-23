import API from "./axios";

export const submitContactInquiry = (body) =>
  API.post("/contact/inquiry", body);

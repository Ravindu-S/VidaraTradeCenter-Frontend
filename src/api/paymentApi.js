import API from "./axios";

export const initiatePayment = (orderNumber) => {
  return API.post("/payment/initiate", { orderNumber });
};

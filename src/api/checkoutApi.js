import API from "./axios";

export const placeOrder = (shippingAddressId) => {
  return API.post("/checkout/place-order", { shippingAddressId });
};

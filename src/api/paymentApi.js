import API from "./axios";

export const initiatePayment = (orderNumber) => {
  return API.post("/payment/initiate", { orderNumber });
};

/** Sandbox: after PayHere onCompleted — mark order paid and trigger confirmation email when notify cannot reach localhost. */
export const reconcileSandboxOrder = (body) =>
  API.post("/payment/reconcile-sandbox-order", body);

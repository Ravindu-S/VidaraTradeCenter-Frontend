import API from "./axios";

/**
 * CART API
 * 
 * Backend endpoints:
 * GET    /api/cart              → get active cart
 * POST   /api/cart/add          → add item to cart
 * PUT    /api/cart/items/:id    → update cart item quantity
 * DELETE /api/cart/items/:id    → remove item from cart
 * DELETE /api/cart/clear        → clear entire cart
 * 
 * Expected CartResponse format:
 * {
 *   id: number,
 *   userId: number,
 *   status: string,
 *   items: CartItemResponse[],
 *   totalAmount: number,
 *   totalItems: number
 * }
 * 
 * Expected CartItemResponse format:
 * {
 *   id: number,
 *   productId: number,
 *   productName: string,
 *   productSlug: string,
 *   productImage: string,
 *   price: number,
 *   quantity: number,
 *   subtotal: number
 * }
 */

// GET /api/cart
export const getCart = () => {
  return API.get("/cart");
};

// POST /api/cart/add
export const addToCart = (productId, quantity) => {
  return API.post("/cart/add", { productId, quantity });
};

// PUT /api/cart/items/:cartItemId
export const updateCartItem = (cartItemId, quantity) => {
  return API.put(`/cart/items/${cartItemId}`, { quantity });
};

// DELETE /api/cart/items/:cartItemId
export const removeCartItem = (cartItemId) => {
  return API.delete(`/cart/items/${cartItemId}`);
};

// DELETE /api/cart/clear
export const clearCart = () => {
  return API.delete("/cart/clear");
};

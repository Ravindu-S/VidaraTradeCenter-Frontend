import API from "./axios";

/**                                                         
PRODUCT API — Placeholder for DEV 3                      
                                                     
Backend endpoints expected:                                
GET  /api/products          → paginated product list     
GET  /api/products/{id}     → single product detail      
GET  /api/categories        → category list              
GET  /api/brands            → brand list                 
                                                              
Expected response format (PagedResponse):                  
    {                                                          
        "content": [ ...products ],                              
        "page": 0,                                               
        "size": 10,                                              
        "totalElements": 50,                                     
        "totalPages": 5,                                         
        "last": false                                            
    }                                                          

  Expected ProductResponse fields:
  id, name, slug, description, price,
  imageUrl, category (object with .name),
  brand (object with .name), stock, status
 */

// GET /api/products?page=0&size=10&sort=createdAt,desc
export const getProducts = (params = {}) => {
  return API.get("/products", { params });
};

// GET /api/products/:id
export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

// Product reviews (GET public; POST / me require JWT via axios interceptor)
export const getProductReviews = (productId) =>
  API.get(`/products/${productId}/reviews`);

export const getMyProductReview = (productId) =>
  API.get(`/products/${productId}/reviews/me`);

export const submitProductReview = (productId, body) =>
  API.post(`/products/${productId}/reviews`, body);

// GET /api/categories (DEV 3: implement when ready)
export const getCategories = () => {
  return API.get("/categories");
};

// GET /api/brands (DEV 3: implement when ready)
export const getBrands = () => {
  return API.get("/brands");
};
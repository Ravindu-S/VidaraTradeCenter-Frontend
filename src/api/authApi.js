import API from "./axios";

/*
     AUTH API — Placeholder for DEV 2                          
                                                             
     Backend endpoints expected:                                
       POST /api/auth/register     → register new user          
       POST /api/auth/login        → login, returns JWT         
       GET  /api/auth/me           → get current user profile   
                                                                
    Login response format (AuthResponse):                      
    {                                                          
       "token": "eyJhbGci...",                                  
       "tokenType": "Bearer",                                   
       "user": {                                                
         "id": 1,                                               
         "firstName": "...",                                    
       "lastName": "...",                                     
         "email": "...",                                        
         "role": "CUSTOMER"                                     
       }                                                        
    }                                                          
                                                                
     Register request format (RegisterRequest):                 
     {                                                          
       "firstName": "...",                                      
       "lastName": "...",                                       
       "email": "...",                                          
       "password": "...",                                       
       "confirmPassword": "..."                                 
     }                                                          
                                                              
 */

// POST /api/auth/register
export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

// POST /api/auth/login
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// GET /api/auth/me (requires JWT in header)
export const getCurrentUser = () => {
  return API.get("/auth/me");
};

// POST /api/auth/forgot-password
export const sendForgotPasswordEmail = (email) => {
  return API.post("/auth/forgot-password", null, { params: { email } });
};

// POST /api/auth/reset-password
export const resetPassword = (data) => {
  return API.post("/auth/reset-password", data);
};

// GET /api/auth/verify-reset-token
export const verifyResetToken = (token) => {
  return API.get("/auth/verify-reset-token", { params: { token } });
};
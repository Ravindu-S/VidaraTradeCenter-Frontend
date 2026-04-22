import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import Addresses from "./pages/profile/Addresses";
import Cart from "./pages/cart/Cart";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Categories from "./pages/admin/Categories";
import Brands from "./pages/admin/Brands";
import AdminOrders from "./pages/admin/Orders";
import ProductList from "./pages/products/ProductList";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyOrdersPage from "./pages/order/MyOrdersPage";
import OrderConfirmationPage from "./pages/order/OrderConfirmationPage";
import PaymentReturnPage from "./pages/payment/PaymentReturnPage";
import PaymentCancelPage from "./pages/payment/PaymentCancelPage";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import SubmitSupportTicket from "./pages/support/SubmitSupportTicket";
import MyTickets from "./pages/support/MyTickets";
import TicketDetail from "./pages/support/TicketDetail";
import AdminTicketList from "./pages/admin/AdminTicketList";
import AdminTicketDetail from "./pages/admin/AdminTicketDetail";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* DEV 2: Profile & Address Management */}
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="profile/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
        {/* DEV 3: Product Catalog */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        {/* DEV 4: Shopping Cart */}
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        {/* DEV 5: Checkout & Payment */}
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="order/confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="payment/return" element={<ProtectedRoute><PaymentReturnPage /></ProtectedRoute>} />
        <Route path="payment/cancel" element={<ProtectedRoute><PaymentCancelPage /></ProtectedRoute>} />
        {/* DEV: Support Ticket */}
        <Route path="support/submit" element={<ProtectedRoute><SubmitSupportTicket /></ProtectedRoute>} />
        <Route path="support/tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
        <Route path="support/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* DEV 2: Admin Panel */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="brands" element={<Brands />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="deliveries" element={<DeliveryManagement />} />
        <Route path="support" element={<AdminTicketList />} />
        <Route path="support/:id" element={<AdminTicketDetail />} />
      </Route>
    </Routes>
  );
}
export default App;

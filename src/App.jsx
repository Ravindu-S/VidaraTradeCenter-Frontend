import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* DEV 3 will add: */}
        {/* <Route path="products" element={<ProductList />} /> */}
        {/* <Route path="products/:id" element={<ProductDetailPage />} /> */}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
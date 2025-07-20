// src/App.jsx
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import SellerLayout from "./layouts/SellerLayout";

// Auth
import ProtectedRoute from "./routes/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";

// Pages - Public
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

// Pages - Seller
import SellerDashboard from "./components/Seller/SellerDashboard";
import AddProduct from "./components/Seller/AddProduct";
import SellerOrders from "./components/Seller/SellerOrders";
import SellerProducts from "./components/Seller/SellerProducts";

import BuyerLayout from "./layouts/BuyerLayout";
import BuyerDashboard from "./components/Buyer/BuyerDashboard";
import BuyerOrders from "./components/Buyer/BuyerOrders";
import ProfilePage from "./pages/Profile";
import ProductPage from "./pages/ProductPage";
import CartPage from "./components/Buyer/CartPage";
import EditProduct from "./components/Seller/EditProduct";
import ChatPage from "./pages/ChatPage";
import SellerChatsPage from "./pages/SellerChatsPage";

// Pages - Buyer

const App = () => {
  const { user, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* 🌐 Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Route>

        {/* 🛒 Seller Layout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/add-product" element={<AddProduct />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/profile" element={<ProfilePage />} />
          <Route path="/seller/edit-product/:id" element={<EditProduct />} />
          <Route path="/seller/chats" element={<SellerChatsPage />} />
          <Route
            path="/seller/chat/:receiverId/:productId"
            element={<ChatPage />}
          />
        </Route>

        {/* 👤 Buyer Layout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/buyer/products" element={<ProductPage />} />
          <Route path="/buyer/profile" element={<ProfilePage />} />
          <Route path="/buyer/cart" element={<CartPage />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route
            path="/buyer/chat/:receiverId/:productId"
            element={<ChatPage />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;

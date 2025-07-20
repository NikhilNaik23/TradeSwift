import React from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const SellerNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/seller/dashboard" className="text-xl font-bold">
        TradeSwift Seller
      </Link>
      <div className="space-x-4">
        <Link to="/seller/products">My Products</Link>
        <Link to="/seller/add-product">Add Product</Link>
        <Link to="/seller/orders">Orders</Link>
        <Link to="/seller/chats" className="px-4 py-2 hover:bg-gray-100">
          Messages
        </Link>

        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default SellerNavbar;

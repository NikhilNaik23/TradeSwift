import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import api from "../../utils/axios";
import useAuthStore from "../../store/useAuthStore";
import useCartStore from "../../store/useCartStore";

const BuyerNavbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.cartItems);

  const handleLogout = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success(res.data.message);
      console.log(res.data);
      logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link
        to="/buyer/dashboard"
        className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition"
      >
        TradeSwift Buyer
      </Link>

      <div className="space-x-6 text-base font-medium flex items-center">
        <Link
          to="/buyer/dashboard"
          className="hover:text-yellow-300 transition"
        >
          Dashboard
        </Link>
        <Link to="/buyer/products" className="hover:text-yellow-300 transition">
          Products
        </Link>
        <Link to="/buyer/orders" className="hover:text-yellow-300 transition">
          My Orders
        </Link>
        <Link to="/buyer/profile" className="hover:text-yellow-300 transition">
          Profile
        </Link>

        <Link
          to="/buyer/cart"
          className="relative hover:text-yellow-300 transition"
        >
          <FaShoppingCart size={20} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartItems.length}
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-yellow-300 hover:text-black transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default BuyerNavbar;

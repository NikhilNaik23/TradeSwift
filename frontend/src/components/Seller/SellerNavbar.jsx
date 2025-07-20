import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import api from "../../utils/axios";
import useAuthStore from "../../store/useAuthStore";

const SellerNavbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success(res.data.message);
      logout();
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Handles hamburger menu open/close and closes menu on navigation
  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center relative">
      {/* Logo/Brand */}
      <Link to="/seller/dashboard" className="text-xl font-bold">
        TradeSwift Seller
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/seller/products" className="hover:text-yellow-300" onClick={handleLinkClick}>
          My Products
        </Link>
        <Link to="/seller/add-product" className="hover:text-yellow-300" onClick={handleLinkClick}>
          Add Product
        </Link>
        <Link to="/seller/orders" className="hover:text-yellow-300" onClick={handleLinkClick}>
          Orders
        </Link>
        <Link to="/seller/chats" className="hover:text-yellow-300" onClick={handleLinkClick}>
          Messages
        </Link>
        <Link to="/seller/profile" className="hover:text-yellow-300" onClick={handleLinkClick}>
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-blue-900"
        >
          Logout
        </button>
      </div>

      {/* Hamburger menu button (mobile only) */}
      <button
        className="md:hidden p-2"
        onClick={() => setOpen(!open)}
        aria-label="Open navigation"
      >
        {open ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-blue-700 text-white flex flex-col items-center md:hidden z-20 shadow-lg">
          <Link to="/seller/products" className="py-2 w-full text-center hover:bg-blue-800" onClick={handleLinkClick}>
            My Products
          </Link>
          <Link to="/seller/add-product" className="py-2 w-full text-center hover:bg-blue-800" onClick={handleLinkClick}>
            Add Product
          </Link>
          <Link to="/seller/orders" className="py-2 w-full text-center hover:bg-blue-800" onClick={handleLinkClick}>
            Orders
          </Link>
          <Link to="/seller/chats" className="py-2 w-full text-center hover:bg-blue-800" onClick={handleLinkClick}>
            Messages
          </Link>
          <Link to="/seller/profile" className="py-2 w-full text-center hover:bg-blue-800" onClick={handleLinkClick}>
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="my-2 bg-white text-blue-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-blue-900 w-11/12"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default SellerNavbar;

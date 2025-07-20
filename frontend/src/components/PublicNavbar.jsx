import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import api from "../utils/axios";
import toast from "react-hot-toast";

const PublicNavbar = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success(res.data.message);
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        TradeSwift
      </Link>

      <nav className="flex items-center gap-4">
        {user ? (
          <>
            {user.email === "admin@ts.com" ? (
              <Link
                to="/admin/dashboard"
                className="text-white bg-black rounded px-4 py-2"
              >
                Admin
              </Link>
            ) : user.role === "seller" ? (
              <Link
                to="/seller/dashboard"
                className="text-white bg-black rounded px-4 py-2"
              >
                Seller
              </Link>
            ) : (
              <Link
                to="/buyer/dashboard"
                className="text-white bg-black rounded px-4 py-2"
              >
                Buyer
              </Link>
            )}
            <span className="text-gray-700">
              Hello, {user.name === "admin" ? "Admin" : user.name.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default PublicNavbar;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import api from "../../utils/axios";
import useAuthStore from "../../store/useAuthStore";
import useCartStore from "../../store/useCartStore";

const BuyerNavbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.cartItems);
  const [open, setOpen] = useState(false);
  const [itemsLength, setItemsLength] = useState(0);

  const handleLogout = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success(res.data.message);
      logout();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };
  const fetchCart = async () => {
    try {
      const res = await api.get("/wishlist/");
      console.log(res.data.wishlist.length)
      setItemsLength(res.data.wishlist.length)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCart();
  });

  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center relative z-30">
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition"
        onClick={handleLinkClick}
      >
        TradeSwift Buyer
      </Link>

      <div className="hidden md:flex space-x-6 text-base font-medium items-center">
        <Link
          to="/"
          className="hover:text-yellow-300"
          onClick={handleLinkClick}
        >
          Dashboard
        </Link>
        <Link
          to="/buyer/products"
          className="hover:text-yellow-300"
          onClick={handleLinkClick}
        >
          Products
        </Link>
        <Link
          to="/buyer/orders"
          className="hover:text-yellow-300"
          onClick={handleLinkClick}
        >
          My Orders
        </Link>
        <Link
          to="/buyer/chats"
          className="hover:text-yellow-300"
          onClick={handleLinkClick}
        >
          Chat
        </Link>
        <Link
          to="/buyer/profile"
          className="hover:text-yellow-300"
          onClick={handleLinkClick}
        >
          Profile
        </Link>
        <Link
          to="/buyer/cart"
          className="relative hover:text-yellow-300"
          onClick={handleLinkClick}
        >
          <FaShoppingCart size={20} />
          {itemsLength > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {itemsLength}
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

      <button
        className="md:hidden p-2"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-blue-600 text-white flex flex-col items-center md:hidden z-50 shadow-xl">
          <Link
            to="/buyer/dashboard"
            className="py-3 w-full text-center border-b border-blue-700 hover:bg-blue-700"
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link
            to="/buyer/products"
            className="py-3 w-full text-center border-b border-blue-700 hover:bg-blue-700"
            onClick={handleLinkClick}
          >
            Products
          </Link>
          <Link
            to="/buyer/orders"
            className="py-3 w-full text-center border-b border-blue-700 hover:bg-blue-700"
            onClick={handleLinkClick}
          >
            My Orders
          </Link>
          <Link
            to="/buyer/chats"
            className="py-3 w-full text-center border-b border-blue-700 hover:bg-blue-700"
            onClick={handleLinkClick}
          >
            Chat
          </Link>
          <Link
            to="/buyer/profile"
            className="py-3 w-full text-center border-b border-blue-700 hover:bg-blue-700"
            onClick={handleLinkClick}
          >
            Profile
          </Link>
          <Link
            to="/buyer/cart"
            className="py-3 w-full text-center border-b border-blue-700 hover:bg-blue-700 relative"
            onClick={handleLinkClick}
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <FaShoppingCart size={20} />
              Cart
            </span>
            {itemsLength > 0 && (
              <span className="absolute top-2 right-[30%] bg-yellow-400 text-blue-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemsLength}
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="my-3 w-11/12 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-yellow-300 hover:text-black transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default BuyerNavbar;

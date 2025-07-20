// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        404 - Page Not Found
      </h1>
      <p className="text-gray-500 text-lg mb-6">
        The page you're looking for doesn't exist.
      </p>
      <button
        className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        onClick={() =>
          navigate(
            !user
              ? "/"
              : user.role === "seller"
              ? "/seller/dashboard"
              : "/buyer/dashboard"
          )
        }
      >
        {!user
          ? "Go Home"
          : user.role === "seller"
          ? "Go to Seller Dashboard"
          : "Go to Buyer Dashboard"}
      </button>
    </div>
  );
};

export default NotFoundPage;

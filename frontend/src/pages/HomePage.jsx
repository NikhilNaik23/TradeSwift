// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/axios";
import ProductCard from "../components/ProductCard";
import useAuthStore from "../store/useAuthStore";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    search: "",
  });

  const fetchProducts = async () => {
    try {
      const { category, condition, search } = filters;
      const res = await api.get("/products", {
        params: {
          category,
          condition,
          search,
          page: 1,
          limit: 12,
        },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error(
        "Error fetching products:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "seller") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }, [user, loading]);
  useEffect(() => {
    if (!user && !loading) {
      fetchProducts();
    }
  }, [filters, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600 font-semibold text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 sm:p-8">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold mb-6 text-center text-indigo-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🌟 Explore the Latest Listings
      </motion.h1>

      <motion.div
        className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="border px-4 py-2 rounded-md shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
        </select>

        <select
          value={filters.condition}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, condition: e.target.value }))
          }
          className="border px-4 py-2 rounded-md shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Any Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="border px-4 py-2 rounded-md shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto flex-grow"
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No products found.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;

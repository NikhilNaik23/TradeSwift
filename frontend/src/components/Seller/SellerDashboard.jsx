import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { motion } from "framer-motion";

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    sold: 0,
    available: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/products/seller-products");
      const products = res.data.products || [];
      console.log(products)

      const total = products.length;
      const sold = products.filter((p) => p.status === "sold").length;
      const available = total - sold;

      setStats({ total, sold, available });
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <motion.div
          className="bg-white p-6 rounded-xl shadow text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-lg font-medium text-gray-600 mb-2">Total Products</p>
          <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg font-medium text-gray-600 mb-2">Available</p>
          <p className="text-4xl font-bold text-green-600">{stats.available}</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg font-medium text-gray-600 mb-2">Sold</p>
          <p className="text-4xl font-bold text-red-600">{stats.sold}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerDashboard;

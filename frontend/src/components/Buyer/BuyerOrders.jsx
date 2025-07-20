import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  sold: "bg-green-100 text-green-800 border-green-300",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Fetch Orders Error:", error);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 text-center text-blue-700"
      >
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500 text-lg"
        >
          You have no orders yet.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => {
            const status = order.status?.toLowerCase() || "pending";
            const statusClass = statusStyles[status] || statusStyles.pending;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition duration-300"
              >
                <div className="mb-4 space-y-1">
                  <h2 className="text-xl font-semibold text-gray-800 break-words">
                    Order ID:{" "}
                    <span className="text-blue-600">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full border text-xs font-medium capitalize ${statusClass}`}
                    >
                      {status}
                    </span>
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    <span className="font-semibold">Product:</span>{" "}
                    {order.product?.title || "N/A"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Price:</span> ₹
                    {order.amount}
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Seller:</span>{" "}
                    {order.seller?.name
                      ? `${order.seller.name} (${order.seller.email})`
                      : "Unknown"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

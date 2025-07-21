import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/sold");
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders.");
    }
  };

  const markAsSold = async (orderId, productId) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: "sold" });
      await api.patch(`/products/${productId}/sold`);
      toast.success("Marked as sold!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const markAsCancelled = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: "cancelled" });
      toast.success("Marked as cancelled!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    const safeFetch = async () => {
      try {
        await fetchOrders();
      } catch (err) {
        console.error(err);
      }
    };
    safeFetch();
  }, []);

  const statusColors = {
    pending: "text-yellow-600",
    sold: "text-green-600",
    cancelled: "text-red-600",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {order.product?.image && (
                <img
                  src={order.product.image}
                  alt={order.product.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {order.product?.title || "Untitled Product"}
              </h3>

              <p className="text-gray-700">
                <span className="font-medium">Buyer:</span> {order.buyer?.name || "N/A"}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {order.buyer?.email || "N/A"}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Price:</span> ₹{order.amount}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Status:</span>{" "}
                <span className={`font-bold ${statusColors[order.status] || "text-gray-600"}`}>
                  {order.status}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {order.status === "pending" && (
                <>
                  <button
                    className="mt-4 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
                    onClick={() => markAsSold(order._id, order.product?._id)}
                  >
                    Mark as Sold
                  </button>
                  <button
                    className="mt-2 w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium"
                    onClick={() => markAsCancelled(order._id)}
                  >
                    Cancel Order
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;

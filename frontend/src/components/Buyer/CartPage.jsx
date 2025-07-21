import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import useCartStore from "../../store/useCartStore";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const removeItemFromCart = useCartStore((state) => state.removeFromCart);
  const clearAllItems = useCartStore((state) => state.clearCart);
  const cart = useCartStore((state) => state.cartItems);

  const fetchCart = async () => {
    try {
      const res = await api.get("/wishlist");
      setCartItems(res.data?.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      removeItemFromCart(id);
      console.log(cart)
      toast.success("Removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/wishlist");
      setCartItems([]);
      clearAllItems();
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
      console.error(err);
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      for (const item of cartItems) {
        await api.post("/orders", {
          product: item.product._id,
          amount: item.product.price,
        });
      }

      toast.success("Order placed successfully 🧾");
      await clearCart();
      navigate("/buyer/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error?.response?.data?.message || "Failed to place order");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl font-semibold">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-zinc-800">
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center text-lg mt-16"
        >
          Your cart is empty. Go grab something cool 👟🧢.
        </motion.div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <Link
                  to={`/products/${item.product._id}`}
                  className="flex items-center gap-5 flex-1 group"
                >
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-xl border group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-800 group-hover:underline">
                      {item.product.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {item.product.description}
                    </p>
                    <p className="text-base font-medium mt-2 text-green-700">
                      ₹{item.product.price}
                    </p>
                  </div>
                </Link>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeFromCart(item._id)}
                  className="w-full md:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-end mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="px-5 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all"
            >
              Clear Cart 🧹
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={placeOrder}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
            >
              Place Order 🧾
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

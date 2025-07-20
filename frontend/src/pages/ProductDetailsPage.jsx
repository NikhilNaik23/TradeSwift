import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../utils/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);

  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user || user.role !== "buyer") return;

    setAddingToCart(true);
    try {
      const res = await api.post(`/wishlist/${product._id}`);
      addToCart(product._id);
      toast.success(res.data.message || "Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setMainImage(data.product?.images?.[0] || "");
    } catch (err) {
      toast.error("Failed to fetch product details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (!product)
    return (
      <div className="text-center text-red-500 mt-10">Product not found.</div>
    );

  return (
    <motion.div
      className="container mx-auto p-4 sm:p-6 max-w-5xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          {mainImage ? (
            <img
              src={mainImage}
              alt="Main product"
              className="w-full h-[300px] sm:h-[400px] object-contain rounded-xl border shadow"
            />
          ) : (
            <div className="text-gray-500 italic">No main image</div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`h-16 w-20 sm:h-20 sm:w-24 object-cover rounded-md cursor-pointer border-2 ${
                  img === mainImage
                    ? "border-blue-500 scale-105"
                    : "border-gray-300"
                } transition-transform duration-200`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-lg text-gray-700 mb-4">{product.description}</p>

          <div className="text-xl font-semibold text-green-600 mb-4">
            ₹{product.price}
          </div>

          <div className="mb-4">
            <span className="font-medium text-gray-700">Category:</span>{" "}
            {product.category || "N/A"}
          </div>

          <div className="mb-4">
            <span className="font-medium text-gray-700">Location:</span>{" "}
            {product.location?.city || "N/A"},{" "}
            {product.location?.state || "N/A"}
          </div>

          <div className="mb-4">
            <span className="font-medium text-gray-700">Contact:</span>{" "}
            {product.contactInfo?.contactNumber || "N/A"} <br />
            <span className="font-medium">Email:</span>{" "}
            {product.contactInfo?.email || "N/A"}
          </div>
          <div>
            {!user ? (
              <Link to={"/login"}>
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                  Add to cart
                </button>
              </Link>
            ) : user.role === "buyer" ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? "Adding..." : "Add to cart"}
                </button>

                {user._id !== product.postedBy && (
                  <Link to={`/buyer/chat/${product.postedBy._id}/${product._id}`}>
                    <button className="mt-3 ml-3 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                      Chat with Seller
                    </button>
                  </Link>
                )}
              </>
            ) : null}
          </div>

          {product.features?.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Features:</span>
              <ul className="list-disc ml-6 mt-1 text-gray-600">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;

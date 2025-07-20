import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/seller-products");
      setProducts(res.data.products);
      console.log(res.data.products);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  const handleMarkAsSold = async (productId) => {
    try {
      await api.patch(`/products/${productId}/sold`);
      toast.success("Product marked as sold");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to mark as sold");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">My Products</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isSold = product.status === "sold";
            return (
              <div
                key={product._id}
                className={`bg-white border rounded-xl shadow p-4 flex flex-col transition-opacity ${
                  isSold ? "opacity-70 grayscale" : ""
                }`}
              >
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-105"
                />
                <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-700 mb-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Category: {product.category || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Location: {product.location?.city}, {product.location?.state}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Phone: {product.contactInfo?.contactNumber}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Email: {product.contactInfo?.email}
                </p>
                <p className="font-bold text-lg mb-3 text-blue-800">
                  ₹{product.price}
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                    disabled={isSold}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(product._id)}
                    disabled={isSold}
                  >
                    Delete
                  </button>
                  {!isSold ? (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      onClick={() => handleMarkAsSold(product._id)}
                    >
                      Mark as Sold
                    </button>
                  ) : (
                    <span className="text-green-700 font-medium px-3 py-1 border border-green-500 rounded">
                      SOLD
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;

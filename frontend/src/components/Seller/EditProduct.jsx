import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    location: { city: "", state: "" },
    contactInfo: { contactNumber: "", email: "" },
    images: [],
  });

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      const prod = data.product;
      setProduct(prod);
      setForm({
        name: prod.title || "",
        description: prod.description || "",
        price: prod.price || "",
        category: prod.category || "",
        location: {
          city: prod.location?.city || "",
          state: prod.location?.state || "",
        },
        contactInfo: {
          contactNumber: prod.contactInfo?.contactNumber || "",
          email: prod.contactInfo?.email || "",
        },
        images: prod.images || [],
      });
      setPreviewImages(prod.images || []);
    } catch (err) {
      toast.error("Failed to load product.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("location", JSON.stringify(form.location));
        formData.append("contactInfo", JSON.stringify(form.contactInfo));
        newImages.forEach((img) => formData.append("images", img));

        response = await api.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.put(`/products/${id}`, form);
      }

      toast.success("Product updated successfully");
      navigate("/seller/products");
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    }
  };

  if (!product) {
    return <div className="p-6 text-center">Loading product...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          rows={4}
          required
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (₹)"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border px-4 py-2 rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="location.city"
            value={form.location.city}
            onChange={handleChange}
            placeholder="City"
            className="border px-4 py-2 rounded disabled:bg-gray-400/30"
            disabled
          />
          <input
            type="text"
            name="location.state"
            value={form.location.state}
            onChange={handleChange}
            placeholder="State"
            className="border px-4 py-2 rounded disabled:bg-gray-400/30"
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="contactInfo.contactNumber"
            value={form.contactInfo.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border px-4 py-2 rounded disabled:bg-gray-400/30"
            disabled
          />
          <input
            type="email"
            name="contactInfo.email"
            value={form.contactInfo.email}
            onChange={handleChange}
            placeholder="Contact Email"
            className="border px-4 py-2 rounded disabled:bg-gray-400/30"
            disabled
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previewImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Preview ${idx}`}
              className="h-32 w-full object-cover rounded shadow"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

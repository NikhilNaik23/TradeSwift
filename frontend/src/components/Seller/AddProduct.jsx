import React, { useRef } from "react";
import api from "../../utils/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

function AddProduct() {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const files = fileInputRef.current.files;

    const phone = form.phone.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("📵 Invalid phone number! Enter a valid 10-digit Indian number.");
      return;
    }

    if (files.length === 0) {
      toast.error("📸 Please upload at least one image.");
      return;
    }

    for (let file of files) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error(`🚫 Invalid file type: ${file.name}`);
        return;
      }
    }

    const data = {
      title: form.title.value,
      description: form.description.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      condition: form.condition.value,
      phone,
    };

    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    for (let i = 0; i < files.length; ++i) {
      fd.append("images", files[i]);
    }

    const toastId = toast.loading("Uploading...");

    try {
      await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Product uploaded successfully!", { id: toastId });
      form.reset();
      fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Server Error", {
        id: toastId,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto mt-12 p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl text-white"
    >
      <h2 className="text-3xl font-bold text-indigo-400 text-center mb-6 tracking-wide">📦 Add a New Product</h2>

      <form ref={formRef} onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-5">
        {[
          { name: "title", placeholder: "Product Title" },
          { name: "description", placeholder: "Description" },
          { name: "price", placeholder: "Price (₹)", type: "number" },
          { name: "phone", placeholder: "Your Contact Number" },
        ].map((field, i) => (
          <motion.input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type || "text"}
            required
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          />
        ))}

        <motion.select
          name="category"
          required
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
        </motion.select>

        <motion.select
          name="condition"
          required
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <option value="">Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </motion.select>

        <motion.input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          required
          ref={fileInputRef}
          className="w-full p-3 border-2 border-dashed border-indigo-500 rounded-lg bg-gray-900 text-gray-300"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={6}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-lg"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={7}
        >
          🚀 Upload Product
        </motion.button>
      </form>
    </motion.div>
  );
}

export default AddProduct;

import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { _id, title, price, images, location, condition } = product;

  return (
    <Link
      to={`/products/${_id}`}
      className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
    >
      <img
        src={images[0]}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">{location.city}, {location.state}</p>
        <p className="text-sm text-gray-500 capitalize">{condition}</p>
        <p className="text-indigo-600 font-bold text-lg mt-2">₹{price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

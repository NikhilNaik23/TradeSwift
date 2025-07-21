import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { motion } from "framer-motion";

const BuyerChatsPage = () => {
  const [inbox, setInbox] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/messages/inbox")
      .then((res) => setInbox(res.data.inbox))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "2rem auto",
        padding: "1.5rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#222" }}>
        Messages
      </h2>
      {inbox.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#888",
            fontStyle: "italic",
          }}
        >
          No messages yet
        </div>
      )}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {inbox.map((conv) => (
          <motion.li
            key={conv._id.buyer + conv._id.product}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: "1rem 1.5rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              transition: "box-shadow 0.3s ease",
            }}
            onClick={() =>
              navigate(`/buyer/chat/${conv._id.buyer}/${conv._id.product}`)
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "#333",
              }}
            >
              {Array.isArray(conv.product?.images) && conv.product.images.length > 0 ? (
                
                <img
                  src={conv.product.images[0]}
                  alt={conv.product.title || "Product"}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  No Img
                </div>
              )}
              <span>
                {conv.buyer?.name || "Buyer"} ⟶ {conv.product?.title || "Product"}
              </span>
            </div>
            <div
              style={{
                color: "#555",
                fontSize: "0.9rem",
                fontWeight: "500",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={conv.lastMessage}
            >
              {conv.lastMessage}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                alignSelf: "flex-start",
                marginTop: "0.6rem",
                padding: "0.4rem 1rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                boxShadow: "0 2px 6px rgba(37, 99, 235, 0.4)",
                transition: "background-color 0.3s ease",
              }}
              onClick={(e) => {
                e.stopPropagation(); 
                navigate(`/seller/chat/${conv._id.buyer}/${conv._id.product}`);
              }}
            >
              View Chat
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerChatsPage;

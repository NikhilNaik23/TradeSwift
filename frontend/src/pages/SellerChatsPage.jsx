import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const SellerChatsPage = () => {
  const [inbox, setInbox] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/messages/inbox")
      .then((res) => setInbox(res.data.inbox))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      {inbox.length === 0 && <div>No messages yet</div>}
      <ul>
        {inbox.map((conv) => (
          <li key={conv._id.buyer + conv._id.product}>
            <strong>{conv.buyer?.name || "Buyer"}</strong> ⟶ {conv.product?.title || "Product"}
            <br />
            <span>{conv.lastMessage}</span>
            <br />
            <button
              onClick={() =>
                navigate(`/seller/chat/${conv._id.buyer}/${conv._id.product}`)
              }
            >
              View Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerChatsPage;

import { useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import ChatBox from "../components/Chat/ChatBox";

const ChatPage = () => {
  const { productId, receiverId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div className="p-4">
      <ChatBox
        currentUser={currentUser}
        receiverId={receiverId}
        productId={productId}
      />
    </div>
  );
};

export default ChatPage;

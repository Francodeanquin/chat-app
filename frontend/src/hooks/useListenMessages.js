import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useConversation();

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => {
          if (!Array.isArray(prevMessages)) {
            console.error("Previous messages state is not an array", prevMessages);
            return [message]; // Reset to a valid array with the new message
          }
          return [...prevMessages, message];
        });
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, setMessages]);
};

export default useListenMessages;

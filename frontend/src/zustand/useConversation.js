import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (update) => {
    set((state) => {
      let newMessages;
      if (typeof update === 'function') {
        newMessages = update(state.messages);
      } else {
        newMessages = update;
      }

      if (!Array.isArray(newMessages)) {
        console.error("setMessages received a non-array value", newMessages);
        newMessages = []; // Reset to an empty array if an invalid value is received
      }

      return { messages: newMessages };
    });
  },
}));

export default useConversation;

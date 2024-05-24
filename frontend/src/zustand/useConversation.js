import { create } from "zustand";

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [], // Aquí se inicializa como un arreglo vacío
    setMessages: (messages) => set({ messages }),
}));

export default useConversation;

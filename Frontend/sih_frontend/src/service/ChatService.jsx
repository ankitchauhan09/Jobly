import api_service from "./api_service.jsx";

export const ChatService = {
  getAllChats: async (senderId, receiverId) => {
    try {
      const response = await api_service.get(
        `http://localhost:8099/chats/all/${senderId}/${receiverId}`
      );
      if (response && response.status === 200) {
        console.log(response);
        return response.data;
      }
      throw new Error("Failed to fetch chats");
    } catch (error) {
      console.error("Error while fetching all the chats:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },
};

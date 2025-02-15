import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Clock, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MentorService } from "../service/MentorService.jsx";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useUser } from "../contexts/UserContext.jsx";
import { ChatService } from "../service/ChatService.jsx";

const MentorChat = () => {
  const { bookingId, mentorId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);

  // Verify user before initializing
  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login", {
        state: { from: `/session/join/text/${bookingId}/${mentorId}` },
      });
      return;
    }

    const setupChat = async () => {
      try {
        await clearDatabaseForCurrentBooking(bookingId);
        await loadPreviousChats();
        initializeSocket();
      } catch (error) {
        console.error("Error setting up chat:", error);
        setConnectionError("Failed to initialize chat. Please try again.");
      }
    };

    setupChat();

    // Cleanup function
    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.send(
          "/app/online-status",
          {},
          JSON.stringify({
            userId: user.id,
            isOnline: false,
          })
        );
        stompClientRef.current.disconnect();
      }
    };
  }, [bookingId, mentorId, user]);

  const loadPreviousChats = async () => {
    const response = await ChatService.getAllChats(user.id, mentorId);
    if (response && Array.isArray(response)) {
      setMessages(response);
    } else {
      console.error("error while processing the chats..");
      console.error(response);
    }
  };

  const initializeSocket = () => {
    if (!user?.id) {
      console.error("Cannot initialize socket: user ID is missing");
      setConnectionError("User authentication required");
      return;
    }

    try {
      const stomp = new SockJS("http://localhost:9011/ws");
      const stompClient = Stomp.over(stomp);
      stompClientRef.current = stompClient;

      stompClient.connect(
        {},
        () => {
          stompClient.send(
            "/app/online-status",
            {},
            JSON.stringify({
              userId: user.id,
              isOnline: true,
            })
          );

          console.log("Connected to the chat socket");
          const subscriptionPath = `/user/${user.id}/chat/private`;
          console.log("Subscribing to:", subscriptionPath);

          stompClient.subscribe(subscriptionPath, handleIncomingMessages);

          const receiverStatusPath = `/user/${mentorId}/online-status`;
          stompClient.subscribe(receiverStatusPath, handleReceiverStatus);

          setConnectionError(null);
        },
        (error) => {
          console.error("STOMP error:", error);
          setConnectionError("Connection failed. Please refresh the page.");
        }
      );
    } catch (error) {
      console.error("Socket initialization error:", error);
      setConnectionError("Failed to connect to chat server.");
    }
  };

  const handleReceiverStatus = (event) => {
    const status = JSON.parse(event.body);
    setIsReceiverOnline(status.isOnline);
  };

  const handleIncomingMessages = (event) => {
    try {
      const newMessage = JSON.parse(event.body);
      console.log("Received message:", newMessage);

      // Ensure unique messageId by checking against existing messages
      if (!messages.some((msg) => msg.messageId === newMessage.messageId)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    } catch (error) {
      console.error("Error processing incoming message:", error);
    }
  };

  const clearDatabaseForCurrentBooking = async (bookingId) => {
    try {
      await MentorService.deleteBookingInfo(bookingId);
    } catch (error) {
      console.error("Error clearing booking info:", error);
    }
  };

  const navigateBackToMentor = () => {
    console.log("Hello world");
    navigate("/mentor/" + mentorId);
  };

  const handleSend = () => {
    if (!message.trim() || !user?.id || !stompClientRef.current?.connected) {
      return;
    }

    try {
      const newMessage = {
        messageId: crypto.randomUUID().toString(),
        senderId: user.id,
        senderName: user.name ? user.name : "Ankit",
        receiverId: mentorId,
        receiverName: "Dr. Sanhok",
        content: message,
        timestamp: new Date().toISOString(),
      };

      stompClientRef.current.send(
        "/app/chat/private",
        {},
        JSON.stringify(newMessage)
      );

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionError("Failed to send message. Please try again.");
    }
  };

  if (connectionError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{connectionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 md:px-20 w-full">
          {/* Mobile Back Button Row */}
          <div className="sm:hidden flex items-center py-2 -mb-2">
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              <ChevronLeft onClick={navigateBackToMentor} className="w-6 h-6" />
            </button>
          </div>

          {/* Main Header Content */}
          <div className="flex flex-col sm:flex-row justify-between py-4">
            <div className="flex items-center">
              {/* Hide back button on desktop since it's moved above on mobile */}
              <button className="hidden sm:block text-gray-400 hover:text-orange-500 transition-colors mr-4">
                <ChevronLeft
                  onClick={navigateBackToMentor}
                  className="w-6 h-6"
                />
              </button>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Mentor"
                    className="w-12 h-12 sm:w-10 sm:h-10 rounded-full ring-2 ring-orange-500"
                  />
                  {isReceiverOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-lg sm:text-base">
                    Dr. Sarah Johnson
                  </h2>
                  <p className="text-sm text-gray-400">
                    Senior Software Architect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="px-4 md:px-20 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`flex ${
                msg.senderId === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[70%] ${
                  msg.senderId === user.id ? "bg-orange-600" : "bg-gray-800"
                } rounded-2xl px-4 py-3`}
              >
                <p className="text-white break-words">{msg.content}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-300 mr-1" />
                  <span className="text-xs text-gray-300">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="px-4 md:px-20 flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
          </div>
          <button
            onClick={handleSend}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-3 transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;

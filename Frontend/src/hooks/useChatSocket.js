// src/hooks/useChatSocket.js
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Define the server URL here

export const useChatSocket = () => {
  // State to hold the messages
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null); // Ref to hold the socket instance

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    socketRef.current = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      cookie: true,
      auth: {
        token: token || "",
      },
    });
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
      setMessages([{ sender: "bot", text: "Hello! How can I assist you?" }]);
    });

    socket.on("chat message", (incomingMsg) => {
      // If incomingMsg is an object: { sender, text }
      const newMsg =
        typeof incomingMsg === "string"
          ? { sender: "bot", text: incomingMsg }
          : incomingMsg;
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });
    socket.on("connect_error", (error) => {
      console.error("Connection failed:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });
    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Function to send a message
  const sendMessage = (messageText) => {
    if (!messageText.trim() || !socketRef.current) return;

    const userMessage = { sender: "user", text: messageText };

    // Add user's message to the UI immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Send the message to the server
    socketRef.current.emit("chat message", messageText);
  };

  // Return the messages and the sendMessage function
  return { messages, sendMessage };
};

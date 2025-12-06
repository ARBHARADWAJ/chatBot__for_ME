// src/hooks/useChatSocket.js
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000"; // Define the server URL here

export const useChatSocket = () => {
  // State to hold the messages
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const socketRef = useRef(null); // Ref to hold the socket instance
  const [loading, setLoading] = useState(false);

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
      // console.log("Connected to WebSocket server:", socket.id);
      socketRef.current.emit("load_sessions", { token: token });
    });

    socket.on("chat message", (incomingMsg) => {
      // If incomingMsg is an object: { sender, text }
      setLoading(false);
      const newMsg =
        typeof incomingMsg === "string"
          ? { role: "bot", message: incomingMsg }
          : incomingMsg;
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      socketRef.current.emit("load_sessions", { token: token });
    });
    socket.on("connect_error", (error) => {
      console.error("Connection failed:", error);
    });

    socket.on("load_messages", (loadedMessages) => {
      const { messages, sessionId } = loadedMessages;
      // if (messages.length === 0) {
      //  alert("no messages found");
        setMessages([{ role: "bot", message: "Hello! How can I assist you?" }]);
      // }
      // console.log("loaded messages", messages, sessionId);
      // console.log("active session id set t--o", activeSessionId);

      setMessages(messages);
    });
    socket.on("load_sessions", (loadedSessions) => {
      // setSessions(loadedSessions);
      setSessions(loadedSessions);

      // NEW: After getting the chats, we check if the list is empty.
      // If it is, THEN we create the first chat. This prevents creating
      // a new chat on every single page refresh.
      if (loadedSessions.length === 0) {
        socket.emit("create new chat", { title: "Default Chat" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    const loadChats = async () => {
      if (!socketRef.current) return;
    };

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
      // loadChats();
    };
  }, []);

  // Function to send a message
  const sendMessage = (messageText, mode, subdivision) => {
    if (!messageText.trim() || !socketRef.current) return;

    const userMessage = {
      role: "user",
      message: messageText,
      mode: mode,
      subdivision: subdivision,
      sessionid: activeSessionId,
    };
    // Add user's message to the UI immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    // Send the message to the server
    // console.log(userMessage);
    socketRef.current.emit("chat message", userMessage);
  };

  const createChatSession = (chatName) => {
    // console.log("new chat name in hook", chatName);
    if (!socketRef.current) return;
    socketRef.current.emit("create_new_chat", { title: chatName });
  };
  const selectChat = (sessionId) => {
    if (!socketRef.current) return;
    setActiveSessionId(sessionId);
    socketRef.current.emit("load_messages", { sessionId: sessionId });
  };

  // Return the messages and the sendMessage function
  return {
    messages,
    sessions,
    sendMessage,
    selectChat,
    createChatSession,
    activeSessionId,
    loading,
    setLoading,
  };
};

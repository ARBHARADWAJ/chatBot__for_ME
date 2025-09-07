// src/hooks/useChatSocket.js
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3000"; // Define the server URL here

export const useChatSocket = () => {
    // State to hold the messages
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null); // Ref to hold the socket instance

    useEffect(() => {
        // Connect to the WebSocket server
        socketRef.current = io(SOCKET_SERVER_URL);
        const socket = socketRef.current;

        // Add a welcome message when connection is established
        socket.on('connect', () => {
            console.log('Connected to WebSocket server:', socket.id);
            setMessages([{ sender: 'bot', text: 'Hello! How can I assist you?' }]);
        });

        // Listen for incoming messages and add them to our messages array
        socket.on('chat message', (incomingMsg) => {
            const newMsg = { sender: 'bot', text: incomingMsg };
            setMessages((prevMessages) => [...prevMessages, newMsg]);
        });

        // Clean up the connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // Function to send a message
    const sendMessage = (messageText) => {
        if (!messageText.trim() || !socketRef.current) return;

        const userMessage = { sender: 'user', text: messageText };
        
        // Add user's message to the UI immediately
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        
        // Send the message to the server
        socketRef.current.emit('chat message', messageText);
    };

    // Return the messages and the sendMessage function
    return { messages, sendMessage };
};
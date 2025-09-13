// src/pages/ChatPage.jsx
import React, { useState } from 'react';
import Input from '../components/ui/Inputs'; // Corrected import names
import Buttons from '../components/ui/Buttons'; // Corrected import names
import { useChatSocket } from '../hooks/useChatSocket'; // Import our new hook

const ChatPage = () => {
    // Use our custom hook to get messages and the send function
    const { messages, sendMessage } = useChatSocket();
    const [newMessage, setNewMessage] = useState("djsfjhdsbfjhbs2"+"\n"+"fjsdfbjsdbffdsdf");

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessage(newMessage); // Use the function from our hook
        setNewMessage("");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex flex-col flex-1">
                <header className="p-4 bg-white border-b">
                    <h1 className="text-xl font-semibold">AI Assistant Chat</h1>
                </header>

                <main className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-lg px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <footer className="p-4 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Buttons type="submit">Send</Buttons>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChatPage;
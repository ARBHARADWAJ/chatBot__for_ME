// src/pages/ChatPage.jsx
import React, { useState, useRef, useEffect } from "react";
import Input from "../components/ui/Inputs";
import Buttons from "../components/ui/Buttons";
import { useChatSocket } from "../hooks/useChatSocket";
import ReactMarkdown from "react-markdown";

const ChatPage = () => {
  const {
    messages,
    sessions,
    activeSessionId, // Get the active ID from the hook
    sendMessage,
    selectChat,
    createChatSession, // Renamed in the hook for clarity
    loading,
    setLoading,
  } = useChatSocket();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // State for the "New Chat" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  //TODO: for the list of rules made from user need to do the list optimisible and user accissble and crud th erules

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(newMessage);
    setLoading(true);
    setNewMessage("");
  };

  // Function to handle creating a new chat from the modal
  const handleCreateChat = (e) => {
    e.preventDefault();
    if (newChatTitle.trim()) {
      console.log("got the new titkle", newChatTitle);

      createChatSession(newChatTitle);
      setNewChatTitle("");

      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- MODAL FOR NEW CHAT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-base font-bold mb-4 ">Create New Chat</h3>
            <form onSubmit={handleCreateChat}>
              <Input
                type="text"
                placeholder="Enter a title..."
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Buttons
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                >
                  Cancel
                </Buttons>
                <Buttons type="submit">Create</Buttons>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-base font-bold">Chat History</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal
          className="m-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          + New Chat
        </button>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {sessions.map((session) => (
              <li
                key={session.sessionId} // Use the permanent _id from MongoDB
                onClick={() => selectChat(session.sessionId)}
                className={`p-4 cursor-pointer truncate ${
                  session.sessionId === activeSessionId
                    ? "bg-gray-700"
                    : "hover:bg-gray-700/50"
                }`}
              >
                {session.title}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex flex-col flex-1">
        <header className="p-4 bg-white border-b shadow-sm flex items-center justify-between">
          <h1 className="text-base font-semibold ml-1">AI Assistant Chat</h1>
          <p
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
          >
            View Rules 📜
          </p>
          {isRulesOpen && (
            <div className="absolute right-1 mt-60 w-70 h-auto bg-white border rounded-lg shadow-xl z-10">
              <ul className="p-1 space-y-1 text-sm text-gray-700 ">
                <li className="px-3 py-2 border-b">
                  <strong>Your Chat Rules:</strong>
                </li>

                <li className="px-3 py-2 rounded hover:bg-gray-100">
                  1. rules1.
                </li>
                <li className="px-3 py-2 rounded hover:bg-gray-100">
                  2. rules 2
                </li>
                <li className="px-3 py-2 rounded hover:bg-gray-100">
                  3.rules 3.
                </li>
              </ul>
            </div>
          )}
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {!activeSessionId ? (
            // If no session is active, show the welcome message
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-xl">👋</span>
              <h2 className="text-base mt-4">Welcome to AI Assistant</h2>
              <p>Select a chat or create a new one to begin.</p>
            </div>
          ) : (
            // Otherwise, show the messages
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {loading}
                  {msg.role === "bot" && <span className="text-xl">🤖</span>}
                  <div
                    className={`text-base max-w-xl px-4 py-3 rounded-xl shadow ${
                      msg.role === "user"
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    ) : (
                      msg.message
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center mt-4">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}
        </main>

        <footer className="p-4 bg-white border-t">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-3"
          >
            <Input
              type="text"
              placeholder={
                !activeSessionId
                  ? "Select a chat to start"
                  : "Type your message..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              autoComplete="off"
              disabled={!activeSessionId} // Disable if no chat is active
            />
            <Buttons type="submit" disabled={!activeSessionId}>
              Send
            </Buttons>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;

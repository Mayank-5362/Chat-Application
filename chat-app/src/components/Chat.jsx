import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import moment from "moment";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

// Create socket connection only when component mounts
// to prevent connection errors during development
const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("anonymous");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState(0);
  const [typingFeedback, setTypingFeedback] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messageContainerRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    
    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server with ID:", newSocket.id);
    });
    
    newSocket.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (socket && e.target.value) {
      socket.emit("feedback", { feedback: `${name} is typing...` });
    } else if (socket) {
      socket.emit("feedback", { feedback: "" });
    }
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    const currentTime = moment().format('h:mm A');
    const newMessage = { 
      name, 
      text: message, 
      time: currentTime
    };

    // Log message being sent for debugging
    console.log("Sending message:", newMessage);

    socket.emit("message", newMessage);
    setMessages(prev => [...prev, { ...newMessage, isOwnMessage: true }]);
    setMessage("");
    socket.emit("feedback", { feedback: "" });
  };

  // Handle socket events
  useEffect(() => {
    if (!socket) return;
    
    socket.on("clients-total", (count) => {
      console.log("Clients total:", count);
      setClients(count);
    });
    
    socket.on("chat-message", (msg) => {
      console.log("Received message:", msg);
      setMessages(prev => [...prev, { ...msg, isOwnMessage: false }]);
    });
    
    socket.on("feedback", (data) => {
      console.log("Typing feedback:", data);
      setTypingFeedback(data.feedback || "");
    });

    return () => {
      socket.off("clients-total");
      socket.off("chat-message");
      socket.off("feedback");
    };
  }, [socket]);

  return (
    <div className="main">
      <h1 className="title">iChat 💬</h1>
      <h3 className="clients-total">
        {isConnected ? `Total clients: ${clients}` : "Connecting to server..."}
      </h3>

      <div className="name">
        <span>👤</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="name-input" />
      </div>

      <TypingIndicator feedback={typingFeedback} />

      <ul className="message-container" ref={messageContainerRef}>
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start chatting!</div>
        ) : (
          // Only map over messages that are valid (not undefined/null)
          messages.filter(msg => msg && msg.text).map((msg, index) => (
            <Message 
              key={index} 
              message={msg} 
              isOwnMessage={Boolean(msg.isOwnMessage)} 
            />
          ))
        )}
      </ul>

      <form className="message-form" onSubmit={sendMessage}>
        <input 
          type="text" 
          value={message} 
          onChange={handleMessageChange} 
          className="message-input"
          placeholder="Type your message here..."
          disabled={!isConnected} 
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!isConnected || !message.trim()}
        >
          Send <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default Chat;

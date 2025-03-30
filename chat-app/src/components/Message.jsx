import React from "react";

const Message = ({ message, isOwnMessage }) => {
  // Safety check - if message is null or undefined, render nothing
  if (!message) {
    return null;
  }
  
  // Make sure we have the required fields, providing defaults if missing
  const {
    text = '',
    name = 'anonymous',
    time = 'just now'
  } = message;
  
  // If no text content, don't render anything
  if (!text) {
    return null;
  }
  
  return (
    <li className={isOwnMessage ? "message-right" : "message-left"}>
      <p className="message">
        {text}
        <span>{name} ● {time}</span>
      </p>
    </li>
  );
};

export default Message;

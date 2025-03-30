import React from "react";

const TypingIndicator = ({ feedback }) => {
  // Only render if feedback is a non-empty string
  return feedback && typeof feedback === 'string' && feedback.trim() ? (
    <div className="typing-feedback">{feedback}</div>
  ) : (
    <div className="typing-feedback"></div> // Always render the container for consistent layout
  );
};

export default TypingIndicator;

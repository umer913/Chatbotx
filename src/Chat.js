import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
const WELCOME_MESSAGE = "Hey there. I am ready when you are. Ask me anything.";

const createChatMessage = (sender, text, idPrefix) => ({
  sender,
  text,
  id: `${idPrefix}-${Date.now()}`
});

const normalizeServerError = message => {
  if (!message) {
    return "Could not reach the server. Check backend and try again.";
  }

  if (message.includes("temporarily running in limited mode") || message.includes("local guidance mode")) {
    return "AI provider quota exhausted. Update billing or API key configuration.";
  }

  return message;
};

const getRequestErrorMessage = error => normalizeServerError(error?.response?.data?.error);

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: WELCOME_MESSAGE,
      id: "welcome"
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const appendMessage = nextMessage => {
    setChat(prev => [...prev, nextMessage]);
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) {
      return;
    }

    appendMessage(createChatMessage("user", trimmedMessage, "u"));
    setMessage("");
    setError("");
    setIsSending(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: trimmedMessage
      });

      appendMessage(createChatMessage("bot", response.data.reply, "b"));
    } catch (requestError) {
      const errorMessage = getRequestErrorMessage(requestError);

      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-orb orb-one" aria-hidden="true" />
      <div className="bg-orb orb-two" aria-hidden="true" />
      <main className="chat-layout">
        <section className="hero-panel">
          <p className="kicker">AI CHAT EXPERIENCE</p>
          <h1>Talk to your assistant with style.</h1>
      
   
        </section>

        <section className="chat-panel">
          <header className="panel-header">
            <h2>Chatbot</h2>
            <span className="status-pill">Online</span>
          </header>

          <div className="messages" role="log" aria-live="polite">
            {chat.map((msg, index) => (
              <div
                key={msg.id}
                className={`message-row ${msg.sender === "user" ? "user" : "bot"}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span className="sender-tag">
                  {msg.sender === "user" ? "You" : "Bot"}
                </span>
                <p>{msg.text}</p>
              </div>
            ))}

            {isSending && (
              <div className="message-row bot typing" aria-label="Bot is typing">
                <span className="sender-tag">Bot</span>
                <p>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </p>
              </div>
            )}
          </div>

          {error && <p className="error-banner">{error}</p>}

          <div className="composer">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Message input"
            />
            <button onClick={sendMessage} disabled={!message.trim() || isSending}>
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Chat;
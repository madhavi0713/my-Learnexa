import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu } from 'react-icons/fi';
import { chatWithAI } from '../../api/helperApi';
import './AIChatWidget.css';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Auto-scroll to latest message ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── Focus input when chat opens ── */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ── Time-based greeting on first open ── */
  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    const greetingMessage = "Hello! I am Learnexa AI Assistant. How can I help you today?";
    setIsTyping(true);

    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages([{ role: 'bot', text: greetingMessage, id: Date.now(), source: 'static' }]);
    }, 900);

    return () => clearTimeout(timer);
  }, [isOpen, messages.length]);

  /* ── Send message handler ── */
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', text: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(trimmed);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: response.reply || "Sorry, no response.", source: response.source || "unknown", id: Date.now() + 1 },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "Sorry, I am having trouble connecting to the server.", source: "error", id: Date.now() + 1 },
      ]);
    }
  };

  /* ── Enter key support ── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  /* ── Toggle chat open/close ── */
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* ────────────── Floating Action Button ────────────── */}
      <button
        id="fluxai-fab-btn"
        className={`fluxai-fab${isOpen ? ' fluxai-fab--open' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close Learnexa AI Chat' : 'Open Learnexa AI Chat'}
        title={isOpen ? 'Close Learnexa AI' : 'Chat with Learnexa AI'}
      >
        {!isOpen && <span className="fluxai-fab-pulse" aria-hidden="true" />}
        {isOpen ? (
          <FiX className="fluxai-fab-icon" />
        ) : (
          <FiMessageSquare className="fluxai-fab-icon" />
        )}
      </button>

      {/* ────────────── Chat Window ────────────── */}
      <div
        id="fluxai-chat-window"
        className={`fluxai-window${isOpen ? ' fluxai-window--visible' : ''}`}
        role="dialog"
        aria-label="Learnexa AI Chat"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="fluxai-header">
          <div className="fluxai-header-left">
            <div className="fluxai-avatar-wrap" aria-hidden="true">
              <FiCpu className="fluxai-avatar-icon" />
              <span className="fluxai-status-pulse" />
            </div>
            <div className="fluxai-header-info">
              <span className="fluxai-bot-name">Learnexa AI</span>
              <span className="fluxai-bot-subtitle">Learning Assistant • Online</span>
            </div>
          </div>
          <button
            id="fluxai-close-btn"
            className="fluxai-header-close"
            onClick={handleToggle}
            aria-label="Close chat"
          >
            <FiX />
          </button>
        </div>

        {/* Messages area */}
        <div
          className="fluxai-messages"
          id="fluxai-messages-container"
          role="log"
          aria-live="polite"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`fluxai-msg fluxai-msg--${msg.role}`}
            >
              {msg.role === 'bot' && (
                <div className="fluxai-bot-icon" aria-hidden="true">
                  <FiCpu />
                </div>
              )}
              <div className="fluxai-bubble">
                {msg.text}
                {msg.role === 'bot' && msg.source && (
                  <div className="fluxai-source-badge" style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, fontStyle: 'italic', display: 'block', textAlign: 'right' }}>
                    {msg.source === 'gemini' ? '✨ Gemini AI' : msg.source === 'static' ? 'Static' : 'Error'}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="fluxai-msg fluxai-msg--bot">
              <div className="fluxai-bot-icon" aria-hidden="true">
                <FiCpu />
              </div>
              <div className="fluxai-bubble fluxai-typing" aria-label="Bot is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}


          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input */}
        <div className="fluxai-footer">
          <input
            ref={inputRef}
            id="fluxai-input-field"
            className="fluxai-input"
            type="text"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Chat message input"
            autoComplete="off"
          />
          <button
            id="fluxai-send-btn"
            className={`fluxai-send${inputValue.trim() ? ' fluxai-send--active' : ''}`}
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatWidget;

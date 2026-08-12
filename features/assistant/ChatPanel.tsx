"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AssistantWidget.module.css";

interface ChatPanelProps {
  onClose: () => void;
  position: { x: number; y: number };
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({ onClose, position }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Add greeting when panel opens
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hallo! Ich bin dein Assistent für KI-System-Check. Wie kann ich dir helfen?",
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // For now, don't send conversation history to avoid Gemini format issues
      // The system instruction provides enough context
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Senden der Nachricht");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate panel position to stay within viewport
  const panelStyle: React.CSSProperties = {
    right: "20px",
    bottom: "20px",
  };

  return (
    <div className={styles.panel} style={panelStyle} ref={panelRef}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <span className={styles.panelIcon}>🤖</span>
          KI-System-Check Assistent
        </div>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Schließen"
        >
          ✕
        </button>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.role === "user" ? styles.userMessage : styles.assistantMessage
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <span className={styles.typingIndicator}>●●●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Stelle eine Frage..."
          className={styles.input}
          disabled={isLoading}
          maxLength={2000}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!input.trim() || isLoading}
          aria-label="Senden"
        >
          {isLoading ? "..." : "→"}
        </button>
      </form>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
}

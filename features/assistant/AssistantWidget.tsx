"use client";

import { useState, useEffect, useRef } from "react";
import { ChatPanel } from "./ChatPanel";
import styles from "./AssistantWidget.module.css";

const GREETINGS = [
  "Hey, brauchst du Hilfe?",
  "Ich kann dir zeigen, wie das funktioniert.",
  "Hast du Fragen zum KI-System-Check?",
  "Ich bin dein Assistent für dieses Tool.",
  "Frag mich gerne etwas!",
  "Ich helfe dir beim Verständnis der Ergebnisse.",
];

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const [position, setPosition] = useState({ x: 20, y: 500 }); // Default for SSR
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPosition({ x: 20, y: window.innerHeight - 100 });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * GREETINGS.length);
      setGreeting(GREETINGS[randomIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !isMounted) return;

      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleClick = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseUp = () => {
    // Small delay to distinguish between drag and click
    setTimeout(() => {
      setIsDragging(false);
    }, 10);
  };

  return (
    <>
      <div
        className={styles.widget}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        title="KI-System-Check Assistent"
      >
        <div className={styles.avatar}>🤖</div>
        {!isOpen && <div className={styles.greeting}>{greeting}</div>}
      </div>

      {isOpen && (
        <ChatPanel
          onClose={() => setIsOpen(false)}
          position={{ x: position.x, y: position.y }}
        />
      )}
    </>
  );
}

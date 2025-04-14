'use client';

import { useState, useEffect } from 'react';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // Load messages from localStorage on mount
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const addMessages = (newMessages: Message[]) => {
    const updatedMessages = [...messages, ...newMessages];
    setMessages(updatedMessages);
    localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return {
    messages,
    addMessages,
    clearHistory,
  };
}
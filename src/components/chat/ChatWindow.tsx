import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string; // Use string for JSON serialization consistency
}

interface ChatWindowProps {
  doctorId: string;
  doctorName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ doctorId, doctorName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');
    setSocket(newSocket);

    const roomId = `chat_${user._id}_${doctorId}`;
    newSocket.emit('join_room', roomId);

    newSocket.on('receive_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [doctorId, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user?._id) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user._id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', {
      ...message,
      roomId: `chat_${user._id}_${doctorId}`,
    });

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b bg-indigo-600 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Chat with Dr. {doctorName}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === user?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === user?._id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

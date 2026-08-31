import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, X, MessageCircle } from 'lucide-react';
import { useHealthSaathi } from '../../context/HealthSaathiContext';
import axiosInstance from '../../api/axiosInstance';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  doctorId: string;
  doctorName: string;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ doctorId, doctorName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useHealthSaathi(); // Fixed: was using dead AuthContext

  // Load chat history on mount
  useEffect(() => {
    if (!user?._id || !doctorId) return;

    const loadHistory = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${doctorId}`);
        const history = (res.data || []).map((msg: any) => ({
          id: msg._id,
          sender: typeof msg.sender === 'object' ? msg.sender._id : msg.sender,
          content: msg.message,
          timestamp: msg.timestamp || msg.createdAt
        }));
        setMessages(history);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, [doctorId, user?._id]);

  // Socket.io connection
  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem('token');
    const newSocket = io(
      import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000',
      {
        auth: { token },
        transports: ['websocket', 'polling']
      }
    );

    newSocket.on('connect', () => {
      setConnected(true);
      const roomId = `chat_${[user._id, doctorId].sort().join('_')}`; // deterministic room ID
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('disconnect', () => setConnected(false));

    newSocket.on('receive_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [doctorId, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?._id) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    const optimisticMsg: Message = {
      id: Date.now().toString(),
      sender: user._id,
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      // Persist to DB via REST
      await axiosInstance.post('/chat', {
        receiverId: doctorId,
        message: messageContent,
      });

      // Also emit via socket for real-time if connected
      if (socket?.connected) {
        const roomId = `chat_${[user._id, doctorId].sort().join('_')}`;
        socket.emit('send_message', {
          ...optimisticMsg,
          roomId,
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m.id !== optimisticMsg.id));
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Dr. {doctorName}</h3>
            <p className="text-xs text-white/70">{connected ? '● Online' : '○ Connecting...'}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                message.sender === user._id
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
              }`}
            >
              <p className="leading-relaxed">{message.content}</p>
              <span className={`text-xs mt-1 block ${
                message.sender === user._id ? 'text-white/60' : 'text-gray-400'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

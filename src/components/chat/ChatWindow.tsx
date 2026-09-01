import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, X, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { useHealthSaathi } from '../../context/HealthSaathiContext';
import axiosInstance from '../../api/axiosInstance';

interface Message { id: string; sender: string; content: string; timestamp: string; }
interface ChatWindowProps { doctorId: string; doctorName: string; onClose?: () => void; userId?: string; }

const ChatWindow: React.FC<ChatWindowProps> = ({ doctorId, doctorName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useHealthSaathi();

  useEffect(() => {
    if (!user?._id || !doctorId) return;
    axiosInstance.get(`/chat/${doctorId}`).then(res => {
      setMessages((res.data || []).map((msg: any) => ({
        id: msg._id,
        sender: typeof msg.sender === 'object' ? msg.sender._id : msg.sender,
        content: msg.message,
        timestamp: msg.timestamp || msg.createdAt
      })));
    }).catch(() => {});
  }, [doctorId, user?._id]);

  useEffect(() => {
    if (!user?._id) return;
    const token = localStorage.getItem('token');
    const newSocket = io(
      import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000',
      { auth: { token }, transports: ['websocket', 'polling'] }
    );
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join_room', `chat_${[user._id, doctorId].sort().join('_')}`);
    });
    newSocket.on('disconnect', () => setConnected(false));
    newSocket.on('receive_message', (msg: Message) => setMessages(prev => [...prev, msg]));
    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, [doctorId, user?._id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?._id) return;
    const content = newMessage.trim();
    setNewMessage('');
    const optimistic: Message = { id: Date.now().toString(), sender: user._id, content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    try {
      await axiosInstance.post('/chat', { receiverId: doctorId, message: content });
      if (socket?.connected) {
        socket.emit('send_message', { ...optimistic, roomId: `chat_${[user._id, doctorId].sort().join('_')}` });
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-[480px] bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 gradient-health text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{doctorName}</h3>
            <div className="flex items-center gap-1 text-xs text-white/70">
              {connected ? <><Wifi className="w-3 h-3" /> Online</> : <><WifiOff className="w-3 h-3" /> Connecting...</>}
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === user._id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                isMe
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-md'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>
                <span className={`text-xs mt-1 block ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-slate-50"
            autoComplete="off"
          />
          <button type="submit" disabled={!newMessage.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

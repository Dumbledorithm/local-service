import { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const socket = io('https://servicepro-10an.onrender.com');

const ChatModal = ({ booking, onClose }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (!booking) return;

    socket.emit('join_room', booking._id);

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/chat/${booking._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    fetchHistory();

    const messageListener = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    socket.on('receive_message', messageListener);

    return () => {
      socket.off('receive_message', messageListener);
    };
  }, [booking]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage.trim() === '' || !booking || !user) return;

    const customerId = booking.user?._id || booking.user;
    const providerId = booking.service?.provider?._id || booking.service?.provider;
    const receiverId = user.id === customerId ? providerId : customerId;

    if (!receiverId) {
        console.error("Could not determine the receiver of the message.");
        return;
    }

    const messageData = {
      booking: booking._id,
      sender: user.id,
      receiver: receiverId,
      content: currentMessage,
    };

    await socket.emit('send_message', messageData);
    
    setCurrentMessage('');
  };

  if (!booking) return null;

  return (
    <dialog id="chat_modal" className="modal" open>
      {/* Updated the modal box for responsiveness */}
      <div className="modal-box w-11/12 max-w-2xl md:max-w-lg">
        <h3 className="font-bold text-lg font-display text-dark">Chat for service: {booking.service.name}</h3>
        
        {/* Updated the chat body for responsiveness */}
        <div ref={chatBodyRef} className="py-4 max-h-[60vh] overflow-y-auto bg-neutral-light rounded-lg my-4 p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`chat ${msg.sender._id === user.id ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-header text-xs opacity-50 text-dark">
                {msg.sender._id === user.id ? "You" : msg.sender.name}
              </div>
              <div className={`chat-bubble ${msg.sender._id === user.id ? 'bg-main-black text-white' : 'bg-white text-dark'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="input input-bordered w-full text-dark"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button type="submit" className="btn manual-btn-primary">Send</button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ChatModal;
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { AppBar } from '../components/Appbar';
import { Card } from '../components/ui/card';
import { Container } from '../components/Container';

interface Message {
  id: string;
  text: string;
  sender: string;
  system?: boolean;
}

export const Chat = () => {
  const { roomId } = useParams();
  const { getToken } = useAuth();
  const socket = useSocket(getToken);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('joinRoom', { roomId });

    socket.on('userJoined', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          sender: 'system',
          system: true,
        },
      ]);
      toast.success(data.message);
    });

    socket.on('message', (data) => {
      setMessages((prev) => [
        ...prev,
        { id: data.id, text: data.text, sender: data.sender },
      ]);
    });

    return () => {
      socket.off('userJoined');
      socket.off('message');
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = { text: newMessage, roomId };
    socket.emit('sendMessage', messageData);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newMessage, sender: 'You' },
    ]);
    setNewMessage('');
  };

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl flex flex-col bg-white'>
        {/* Dashboard Navbar with Room ID */}
        <AppBar isActive={true} roomId={roomId ?? ''} />

        {/* Chat Messages */}
        <div className='flex-1 overflow-y-auto space-y-2 p-4'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-md w-fit max-w-[80%] ${
                msg.system ? 'text-gray-500 italic' : 'bg-gray-600 text-black'
              }`}
            >
              {msg.system ? msg.text : `${msg.sender}: ${msg.text}`}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className='flex items-center gap-2 p-2 bg-gray-100 rounded-md'>
          <Input
            type='text'
            placeholder='Type a message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className='flex-1 p-2 text-black bg-white border border-gray-300 rounded-md'
          />
          <Button
            onClick={sendMessage}
            className='px-4 py-2 bg-blue-500 text-white'
          >
            Send
          </Button>
        </div>
      </Card>
    </Container>
  );
};

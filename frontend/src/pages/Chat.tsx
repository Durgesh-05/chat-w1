import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { AppBar } from '../components/Appbar';
import { Card } from '../components/ui/card';
import { Container } from '../components/Container';
import { getMessages } from '../services';
import { Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  clerkUserId: string;
}

export const Chat = ({ socket }: { socket: Socket | null }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!socket || !roomId) return;

    const fetchMessage = async () => {
      const messages = await getMessages(getToken, roomId);
      setMessages(
        messages.map((msg: Message) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          createdAt: msg.createdAt,
          clerkUserId: msg.clerkUserId,
        }))
      );
    };

    socket.emit('joinRoom', { roomId });

    socket.on(
      'userJoined',
      ({ roomId, name }: { roomId: string; name: string }) => {
        toast.success(`${name} Joined ${roomId}`, { duration: 3000 });
      }
    );

    socket.on('message', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          content: data.content,
          senderId: data.senderId,
          createdAt: data.createdAt,
          clerkUserId: data.clerkUserId,
        },
      ]);
    });

    fetchMessage();

    return () => {
      navigate('/dashboard');
      socket.off('userJoined');
      socket.off('message');
      socket.emit('leaveRoom', { roomId });
    };
  }, [socket, roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      content: newMessage,
      roomId,
      createdAt: new Date().toISOString(),
      clerkUserId: user?.id as string,
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl flex flex-col bg-white'>
        <AppBar isActive={true} roomId={roomId ?? ''} />

        <div className='flex-1 overflow-y-auto space-y-2 p-4'>
          {messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`relative p-2 rounded-md w-fit max-w-[60%] break-words ${
                msg.clerkUserId === user?.id
                  ? 'bg-gray-200 ml-auto'
                  : 'bg-gray-100'
              }`}
            >
              <div className='flex '>
                <span className='pb-2'>{msg.content}</span>
                <span className='text-xs text-gray-500 self-end pl-2'>
                  {new Date(msg.createdAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h23',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

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
            className='px-4 py-2 bg-gray-900 text-white'
          >
            Send
          </Button>
        </div>
      </Card>
    </Container>
  );
};

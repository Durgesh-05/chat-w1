import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { AppBar } from '../components/Appbar';
import { Card } from '../components/ui/card';
import { Container } from '../components/Container';
import { getMessages, saveMessage } from '../services';
import { Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: string;
}

export const Chat = ({ socket }: { socket: Socket | null }) => {
  const { roomId } = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  // const { socket } = useSocket(getToken);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!socket || !roomId) return;

    const fetchMessage = async () => {
      const messages = await getMessages(getToken, roomId);
      setMessages(
        messages.map((msg: any) => {
          return {
            id: msg.id,
            text: msg.content,
            sender: msg.sender.clerkUserId,
          };
        })
      );
    };

    socket.emit('joinRoom', { roomId });

    socket.on('userJoined', ({ roomId }: { roomId: string }) => {
      toast.success('User Joined ' + roomId, { duration: 3000 });
    });

    socket.on('message', (data) => {
      setMessages((prev) => [
        ...prev,
        { id: data.id, text: data.text, sender: data.sender.userId },
      ]);
    });

    fetchMessage();

    return () => {
      socket.off('userJoined');
      socket.off('message');
      socket.emit('leaveRoom', { roomId });
    };
  }, [socket, roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      text: newMessage,
      roomId,
      sender: user?.id as string,
    };
    const isMessageSent = await saveMessage(
      getToken,
      roomId as string,
      newMessage,
      user?.id as string
    );
    if (isMessageSent) {
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    } else {
      toast.error('Failed to store message ', { duration: 3000 });
    }
  };

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl flex flex-col bg-white'>
        <AppBar isActive={true} roomId={roomId ?? ''} />

        <div className='flex-1 overflow-y-auto space-y-2 p-4'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-md w-fit max-w-[80%] ${
                msg.sender === user?.id ? 'bg-gray-200 ml-auto' : 'bg-gray-100'
              }`}
            >
              {msg.text}
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

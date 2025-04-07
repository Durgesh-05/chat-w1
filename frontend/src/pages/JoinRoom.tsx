import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '@clerk/clerk-react';
import { joinRoom } from '../services';
import { Card } from '../components/ui/card';
import { Container } from '../components/Container';
import { AppBar } from '../components/Appbar';

export const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { socket } = useSocket(getToken);

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error('Please enter a valid Room ID');
      return;
    }

    try {
      const data = await joinRoom(roomId, getToken);
      if (!data) throw new Error('Failed to join room');
      socket?.emit('joinRoom', { roomId });
      toast.success('Joined room successfully!');
      navigate(`/chat/${roomId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error joining room'
      );
    }
  };

  return (
    <Container>
      <Card className='w-full h-full shadow-xl relative md:w-[50%] md:mx-auto md:h-[80vh]'>
        <AppBar isActive={false} roomId={''} />
        <div className='flex flex-col items-center gap-4 justify-center h-full'>
          <Input
            type='text'
            placeholder='Enter Room ID'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='w-[250px] p-3 text-lg border border-gray-300 rounded-md'
          />
          <div>
            <Button onClick={handleJoinRoom} className='text-lg px-6 py-3'>
              Join Room
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

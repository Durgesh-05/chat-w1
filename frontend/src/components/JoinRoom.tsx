import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '@clerk/clerk-react';

export const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const {getToken} = useAuth()
  const socket = useSocket(getToken)

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a valid Room ID');
      return;
    }

    socket?.emit("joinRoom", {roomId})
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <Input
        type='text'
        placeholder='Enter Room ID'
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className='w-[250px] p-3 text-lg border border-gray-300 rounded-md'
      />
      <Button onClick={handleJoinRoom} className='text-lg px-6 py-3'>
        Join Room
      </Button>
    </div>
  );
};

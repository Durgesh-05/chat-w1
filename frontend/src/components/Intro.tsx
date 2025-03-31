import {  useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface IntroProps {
  handleCreateRoom: () => Promise<void>;
}

export const Intro = ({
  handleCreateRoom,
}: IntroProps) => {
  const navigate = useNavigate()
  return (
    <div className='flex h-full flex-col justify-center items-center text-gray-400'>
      <p className='text-xl font-semibold'>No Available Rooms</p>
      <p className='text-lg mt-1'>
        Create or Join a new room to start chatting.
      </p>
      <div className='flex gap-4 mt-4'>
        <Button className=' text-lg p-6' onClick={handleCreateRoom}>
          Create Rooms
        </Button>
        <Button className=' text-lg p-6' onClick={() => navigate('/join')}>
          Join Rooms
        </Button>
      </div>
    </div>
  );
};

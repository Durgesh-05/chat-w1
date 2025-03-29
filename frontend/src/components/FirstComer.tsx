import { useState } from 'react';
import { Button } from './ui/button';
import { JoinRoom } from './JoinRoom';

export const FirstComer = ({
  handleCreateRoom,
}: {
  handleCreateRoom: () => Promise<void>;
}) => {
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  return (
    <>
      {isJoiningRoom ? (
        <div className='flex h-full flex-col justify-center items-center'>
          <JoinRoom />
        </div>
      ) : (
        <div className='flex h-full flex-col justify-center items-center text-gray-400'>
          <p className='text-xl font-semibold'>No Available Rooms</p>
          <p className='text-lg mt-1'>
            Create or Join a new room to start chatting.
          </p>
          <div className='flex gap-4 mt-4'>
            <Button className=' text-lg p-6' onClick={handleCreateRoom}>
              Create Rooms
            </Button>
            <Button
              className=' text-lg p-6'
              onClick={() => setIsJoiningRoom(true)}
            >
              Join Rooms
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

import { UserButton } from '@clerk/clerk-react';
import { Clipboard } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoomActiveStatus {
  isActive: boolean;
  roomId?: string;
}

export const DashboardNav = ({ isActive, roomId }: RoomActiveStatus) => {
  const copyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  };

  const formattedRoomId = roomId
    ? `#${roomId.slice(0, 3)}....${roomId.slice(-3)}`
    : '';

  return (
    <div className='w-full bg-[#1e1f20] flex p-6 rounded justify-between items-center'>
      <div className='text-gray-100 font-semibold text-xl'>Chat-W1</div>
      {isActive && roomId && (
        <div className='flex items-center justify-center gap-2 text-gray-200 text-lg font-semibold bg-[#2c2c2c] px-4 py-1 rounded-lg'>
          <span className='text-lg'>{formattedRoomId}</span>
          <Clipboard
            className='cursor-pointer hover:text-white'
            onClick={copyRoomId}
            size={'18px'}
          />
        </div>
      )}
      <UserButton />
    </div>
  );
};

import { UserButton } from '@clerk/clerk-react';

interface RoomActiveStatus {
  isActive: boolean;
  roomId?: string;
}

export const DashboardNav = ({ isActive, roomId }: RoomActiveStatus) => {
  return (
    <div className='w-[100%] bg-[#1e1f20] flex p-6 rounded justify-between items-center'>
      <div className='text-gray-100 font-semibold text-xl'>chat-w1</div>
      {isActive ? (
        <div className='text-gray-200 text-lg font-semibold'>
          #{roomId ? roomId : ''}
        </div>
      ) : (
        ''
      )}
      <UserButton />
    </div>
  );
};

import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Card } from '../components/ui/card';
import { User } from '../types';

export const RoomCard = ({
  users,
  roomId,
  currentUserId,
  activeUsers,
}: {
  users: User[];
  roomId: string;
  currentUserId: string | undefined;
  activeUsers: string[];
}) => {
  const otherUsers = users.filter((u) => u.id !== currentUserId);
  const selectedUser = otherUsers[0] || null;

  if (!selectedUser) return null;

  return (
    <Card className='relative flex items-center justify-between p-4 shadow-lg cursor-pointer hover:bg-gray-100 transition'>
      <div className='flex items-center gap-4 w-full'>
        <div className='relative'>
          <Avatar className='w-12 h-12'>
            <AvatarImage
              src={selectedUser.profileImage}
              alt={selectedUser.firstName}
            />
            <AvatarFallback>{selectedUser.firstName[0]}</AvatarFallback>
          </Avatar>
          {activeUsers.includes(selectedUser.id) && (
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
          )}
        </div>

        <div className='flex flex-col flex-1'>
          <div className='text-gray-900 font-bold text-lg'>
            {selectedUser.firstName}
          </div>
          <div className='text-gray-500 font-bold text-sm'>
            #{roomId.slice(0, 7)}....{roomId.slice(-7)}
          </div>
        </div>

        <div className='absolute right-4 bottom-2 text-gray-500 text-sm font-normal'>
          {new Date(selectedUser.lastSeen).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
          })}
        </div>
      </div>
    </Card>
  );
};

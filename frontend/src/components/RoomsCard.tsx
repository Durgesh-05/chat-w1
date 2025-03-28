import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';
import { User } from '../types';

export const RoomCard = ({ user }: { user: User }) => {
  return (
    <Card className='flex items-center justify-between p-4 shadow-lg cursor-pointer hover:bg-gray-100 transition'>
      <div className='flex items-center gap-4'>
        <Avatar className='w-12 h-12'>
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <div>
          <div className='text-gray-900 font-semibold'>{user.name}</div>
          <div className='text-gray-600 text-sm truncate w-40'>
            {user.lastMessage}
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <span className='text-xs text-gray-500'>{user.time}</span>
        <span
          className={cn(
            'w-3 h-3 rounded-full mt-1',
            user.isActive ? 'bg-green-500' : 'bg-gray-500'
          )}
        ></span>
      </div>
    </Card>
  );
};

import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Card } from '../components/ui/card';
import { User } from '../types';

export const RoomCard = ({ user, roomId }: { user: User, roomId: string }) => {
  console.log(user);
  
  return (
    <Card className='flex items-center justify-between p-4 shadow-lg cursor-pointer hover:bg-gray-100 transition'>
      <div className='flex items-center gap-4'>
        <Avatar className='w-12 h-12'>
          <AvatarImage src={user.profileImage} alt={user.firstName} />
          <AvatarFallback>{user.firstName}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-center items-start'>
          <div className='text-gray-900 font-semibold'>{user.firstName}</div>
          <div className='text-gray-500 font-semibold text-sm'>#{roomId}</div>
        </div>
      </div>
    </Card>
  );
};

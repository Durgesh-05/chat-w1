import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Card } from '../components/ui/card';
import { User } from '../types';

export const RoomCard = ({
  users,
  roomId,
  currentUserId,
}: {
  users: User[];
  roomId: string;
  currentUserId: string | undefined;
}) => {
  const otherUsers = users.filter((u) => u.id !== currentUserId);

  return (
    <Card className='flex items-center justify-between p-4 shadow-lg cursor-pointer hover:bg-gray-100 transition'>
      <div className='flex items-center gap-4'>
        {otherUsers.length === 1 ? (
          <>
            <Avatar className='w-12 h-12'>
              <AvatarImage
                src={otherUsers[0].profileImage}
                alt={otherUsers[0].firstName}
              />
              <AvatarFallback>{otherUsers[0].firstName[0]}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-center items-start'>
              <div className='text-gray-900 font-semibold'>
                {otherUsers[0].firstName}
              </div>
              <div className='text-gray-500 font-semibold text-sm'>
                #{roomId}
              </div>
            </div>
          </>
        ) : (
          <div className='flex -space-x-4'>
            {otherUsers.slice(0, 3).map((user, index) => (
              <Avatar
                key={user.id}
                className={`w-10 h-10 border-2 border-white ${
                  index > 0 ? '-ml-2' : ''
                }`}
              >
                <AvatarImage src={user.profileImage} alt={user.firstName} />
                <AvatarFallback>{user.firstName[0]}</AvatarFallback>
              </Avatar>
            ))}
            {otherUsers.length > 3 && (
              <div className='w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full text-sm font-semibold border-2 border-white'>
                +{otherUsers.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

import { useAuth, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { Container } from '../components/Container';
import { Card } from '../components/ui/card';
import { AppBar } from '../components/Appbar';
import { Intro } from '../components/Intro';
import { createRoom } from '../services';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import { RoomCard } from '../components/RoomsCard';
import { CustomSkeleton } from '../components/CustomSkeleton';
import { CustomDialog } from '../components/CustomDialog';
import { useFetchRooms } from '../hooks/useFetchRooms';

export const Dashboard = () => {
  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const socket = useSocket(getToken);
  const { rooms, loading, filteredRooms } = useFetchRooms(getToken);

  const handleCreateRoom = async () => {
    if (!socket) return;
    const room = await createRoom(getToken);
    if (!room) return;
    setRoomCreated(true);
    setRoomId(room.id);
    socket.emit('joinRoom', { roomId: room.id });
    navigate(`/chat/${room.id}`);
  };

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl relative'>
        <AppBar isActive={roomCreated} roomId={roomId ?? ''} />
        {rooms.length === 0 && !roomCreated ? (
          loading ? (
            <div className='p-4 flex flex-col gap-y-6'>
              {Array.from({ length: 5 }).map((_, index) => {
                return <CustomSkeleton key={index} />;
              })}
            </div>
          ) : (
            <Intro handleCreateRoom={handleCreateRoom} />
          )
        ) : (
          <>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const currentUser = room.users.find(
                  (u: any) => u.email === user?.emailAddresses[0].emailAddress
                );
                return (
                  <div key={room.id}>
                    <div className='mt-2 mx-4'>
                      <RoomCard
                        users={room.users}
                        roomId={room.id}
                        currentUserId={currentUser?.id}
                      />
                    </div>
                    <div className='absolute bottom-8 right-8 '>
                      <CustomDialog handleCreateRoom={handleCreateRoom} />
                    </div>
                  </div>
                );
              })
            ) : (
              <Intro handleCreateRoom={handleCreateRoom} />
            )}
          </>
        )}
      </Card>
    </Container>
  );
};

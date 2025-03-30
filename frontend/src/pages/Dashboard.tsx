import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Card } from '../components/ui/card';
import { DashboardNav } from '../components/DashboardNav';
import { FirstComer } from '../components/FirstComer';
import { createRoom, getRooms } from '../services';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import { RoomCard } from '../components/RoomsCard';

export const Dashboard = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>('');
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const socket = useSocket(getToken);

  useEffect(() => {
    async function fetchRooms() {
      const fetchedRooms = await getRooms(getToken);
      setRooms(fetchedRooms);

      const roomsToBeFiltered = fetchedRooms.filter(
        (room: any) => room.users.length >= 2
      );

      setFilteredRooms(roomsToBeFiltered);
    }
    fetchRooms();
  }, []);

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
      <Card className='w-[600px] h-[700px] shadow-xl'>
        <DashboardNav isActive={roomCreated} roomId={roomId ?? ''} />
        {rooms.length === 0 && !roomCreated ? (
          <FirstComer handleCreateRoom={handleCreateRoom} />
        ) : (
          <>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const currentUser = room.users.find(
                  (u: any) => u.email === user?.emailAddresses[0].emailAddress
                );
                return (
                  <div className='mt-2 mx-4' key={room.id}>
                    <RoomCard
                      users={room.users}
                      roomId={room.id}
                      currentUserId={currentUser?.id}
                    />
                  </div>
                );
              })
            ) : (
              <FirstComer handleCreateRoom={handleCreateRoom} />
            )}
          </>
        )}
      </Card>
    </Container>
  );
};

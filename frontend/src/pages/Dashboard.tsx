import { useAuth } from '@clerk/clerk-react';
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
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const socket = useSocket(getToken);

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getRooms(getToken);
      setRooms(rooms);
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
      <Card className='w-[600px] h-[700px] shadow-xl '>
        <DashboardNav isActive={roomCreated} roomId={roomId ?? ''} />
        {rooms.length === 0 && !roomCreated ? (
          <FirstComer handleCreateRoom={handleCreateRoom} />
        ) : (
          <div className='mt-2 mx-4'>
            {rooms.map((room) => (
              <RoomCard key={room.id} user={room.users[0]} roomId={room.id} />
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
};

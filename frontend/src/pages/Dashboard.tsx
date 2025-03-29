import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';
import { Container } from '../components/Container';
import { Card } from '../components/ui/card';
import { DashboardNav } from '../components/DashboardNav';
import { FirstComer } from '../components/FirstComer';
import { createRoom, getRooms } from '../services';

export const Dashboard = () => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>('');

  console.log(roomCreated);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();
      const socketConnection = io(import.meta.env.VITE_WEBSOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketConnection.on('connect', () => {
        toast.success(
          'Successfully Connected to SocketIO ' + socketConnection.id,
          { duration: 3000 }
        );
      });

      socketConnection.on('joinedRoom', ({ roomId }) => {
        toast.success('Successfully joined the room ' + roomId, {
          duration: 3000,
        });
      });

      socketConnection.on('disconnect', (reason) => {
        toast.error('SocketIO disconnected due to ' + reason);
      });

      setSocket(socketConnection);
    };

    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, [getToken]);

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
  };

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl'>
        <DashboardNav isActive={roomCreated} roomId={roomId ?? ''} />
        {rooms.length === 0 && !roomCreated && (
          <FirstComer handleCreateRoom={handleCreateRoom} />
        )}
      </Card>
    </Container>
  );
};

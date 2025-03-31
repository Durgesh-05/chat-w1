import { useState, useEffect } from 'react';
import { getRooms } from '../services';

export const useFetchRooms = (getToken: () => Promise<string | null>) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const fetchedRooms = await getRooms(getToken);
      setRooms(fetchedRooms);
      setLoading(false);
      const roomsToBeFiltered = fetchedRooms.filter(
        (room: any) => room.users.length >= 2
      );

      setFilteredRooms(roomsToBeFiltered);
    };

    fetchRooms();

    return () => {
      setRooms([]);
      setFilteredRooms([]);
    };
  }, []);

  return { rooms, loading, filteredRooms };
};

import axios from 'axios';

const getRequest = async (
  url: string,
  getToken: () => Promise<string | null>
) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error('Token is null or undefined');
      return null;
    }

    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data ?? null;
  } catch (error) {
    console.error('Error in getRequest:', error);
    return null;
  }
};

export const getRooms = async (getToken: () => Promise<string | null>) => {
  const data = await getRequest(
    `${import.meta.env.VITE_API_URL}/api/rooms`,
    getToken
  );
  return data.rooms ?? null;
};

export const createRoom = async (getToken: () => Promise<string | null>) => {
  try {
    const token = await getToken();
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/rooms`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.room;
  } catch (error) {
    console.error('Error creating room:', error);
    return null;
  }
};

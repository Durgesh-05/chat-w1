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

export const joinRoom = async (
  roomId: string,
  getToken: () => Promise<string | null>
) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error('Token is null or undefined');
      return null;
    }

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/rooms/join`,
      { roomId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data ?? null;
  } catch (error) {
    console.error('Error joining room:', error);
    return null;
  }
};

export const getMessages = async (
  getToken: () => Promise<string | null>,
  roomId: string
) => {
  const data = await getRequest(
    `${import.meta.env.VITE_API_URL}/api/messages/${roomId}`,
    getToken
  );
  return data.messages ?? null;
};

export const saveMessage = async (
  getToken: () => Promise<string | null>,
  roomId: string,
  msg: string,
  senderId: string
) => {
  try {
    const token = await getToken();
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      {
        roomId,
        senderId,
        text: msg,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.status === 200;
  } catch (error) {
    console.error('Error sending messages:', error);
    return false;
  }
};

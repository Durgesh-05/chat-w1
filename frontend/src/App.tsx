import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SignInPage } from './pages/Signin';
import { Chat } from './pages/Chat';
import { JoinRoom } from './pages/JoinRoom';
import { useAuth } from '@clerk/clerk-react';
import { useSocket } from './hooks/useSocket';
import { useFetchRooms } from './hooks/useFetchRooms';
import { ProtectedRoute } from './pages/Protected';

export default function App() {
  const { getToken } = useAuth();
  const { socket, activeUsers } = useSocket(getToken);
  const { rooms, filteredRooms, loading } = useFetchRooms(getToken);
  return (
    <Routes>
      <Route path='/' element={<SignUpPage />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard
              rooms={rooms}
              filteredRooms={filteredRooms}
              loading={loading}
              socket={socket}
              activeUsers={activeUsers}
            />
          </ProtectedRoute>
        }
      />
      <Route path='/signin' element={<SignInPage />} />
      <Route
        path='/join'
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path='/chat/:roomId'
        element={
          <ProtectedRoute>
            <Chat socket={socket} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

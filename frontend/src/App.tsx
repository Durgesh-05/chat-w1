import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SignInPage } from './pages/Signin';
import { Chat } from './pages/Chat';
import { JoinRoom } from './pages/JoinRoom';
import { useAuth } from '@clerk/clerk-react';
import { useSocket } from './hooks/useSocket';

export default function App() {
  const {getToken} = useAuth()
  const {socket, activeUsers} = useSocket(getToken)
  return (
    <Routes>
      <Route path='/' element={<SignUpPage />} />
      <Route path='/dashboard' element={<Dashboard  socket={socket} activeUsers={activeUsers}/>} />
      <Route path='/signin' element={<SignInPage />} />
      <Route path='/join' element={<JoinRoom />} />
      <Route path='/chat/:roomId' element={<Chat socket={socket}/>} />
    </Routes>
  );
}

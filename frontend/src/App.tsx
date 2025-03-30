import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SignInPage } from './pages/Signin';
import { Chat } from './pages/Chat';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<SignUpPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/signin' element={<SignInPage />} />
      <Route path='/chat/:roomId' element={<Chat />} />
    </Routes>
  );
}

import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<SignUpPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );
}

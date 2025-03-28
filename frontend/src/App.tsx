import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SignInPage } from './pages/Signin';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<SignInPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/signin' element={<SignInPage />} />
    </Routes>
  );
}

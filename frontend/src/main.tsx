import { ClerkProvider } from '@clerk/clerk-react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { dark } from '@clerk/themes';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/'
      appearance={{ baseTheme: dark }}
      signInUrl='/signin'
      signUpUrl='/'
    >
      <App />
      <Toaster position='bottom-right' />
    </ClerkProvider>
  </BrowserRouter>
);

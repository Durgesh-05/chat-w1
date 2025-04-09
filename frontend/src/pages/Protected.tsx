import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { Container } from '../components/Container';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}

import { SignIn } from '@clerk/clerk-react';
import { useSignIn } from '@clerk/clerk-react';
import { Container } from '../components/Container';

export const SignInPage = () => {
  const { isLoaded } = useSignIn();

  if (!isLoaded) {
    <Container>
      <div className='text-4xl font-bold'>Loading...</div>
    </Container>;
  }

  return (
    <Container>
      <SignIn forceRedirectUrl='/dashboard' />
    </Container>
  );
};

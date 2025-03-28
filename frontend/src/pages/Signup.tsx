import { SignUp } from '@clerk/clerk-react';
import { useSignUp } from '@clerk/clerk-react';
import { Container } from '../components/Container';

export const SignUpPage = () => {
  const { isLoaded } = useSignUp();

  if (!isLoaded) {
    <Container>
      <div className='text-4xl font-bold'>Loading...</div>
    </Container>;
  }

  return (
    <Container>
      <SignUp forceRedirectUrl='/dashboard' />
    </Container>
  );
};

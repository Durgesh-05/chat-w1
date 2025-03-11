import { SignUp } from '@clerk/clerk-react';
import { useSignUp } from '@clerk/clerk-react';

export const SignUpPage = () => {
  const { isLoaded } = useSignUp();

  if (!isLoaded) {
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='text-4xl font-bold'>Loading...</div>
    </div>;
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <SignUp forceRedirectUrl='/dashboard' />
    </div>
  );
};

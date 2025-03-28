import { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      {children}
    </div>
  );
};

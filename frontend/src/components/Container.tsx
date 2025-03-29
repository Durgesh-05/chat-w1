import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={`w-screen h-screen flex justify-center items-center ${className}`}
    >
      {children}
    </div>
  );
};

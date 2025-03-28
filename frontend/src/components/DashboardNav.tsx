import { UserButton } from '@clerk/clerk-react';

export const DashboardNav = () => {
  return (
    <div className='w-[100%] bg-[#1e1f20] flex p-6 rounded justify-between items-center'>
      <div className='text-gray-100 font-semibold text-lg'>chat-w1</div>
      <UserButton />
    </div>
  );
};

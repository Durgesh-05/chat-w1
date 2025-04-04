export const TypingIndicator = () => {
  return (
    <div className='flex items-center gap-2 p-2'>
      <span className='text-sm text-gray-500'>Typing</span>
      <div className='flex gap-1'>
        <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></span>
        <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></span>
        <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></span>
      </div>
    </div>
  );
};

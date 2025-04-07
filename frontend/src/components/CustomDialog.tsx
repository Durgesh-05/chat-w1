import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IDialogProps {
  handleCreateRoom: () => Promise<void>;
}

export const CustomDialog = ({ handleCreateRoom }: IDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CirclePlus className='bg-gray-950 text-white rounded-full' size={34} />
      </DialogTrigger>
      <DialogContent className='w-[350px] sm:w-full'>
        <DialogHeader>
          <DialogTitle>Create/Join Rooms </DialogTitle>
          <DialogDescription>
            Create or Join rooms smoothly with single click.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-x-4 '>
          <Button onClick={handleCreateRoom}>Create Room</Button>
          <Button onClick={() => navigate('/join')}>Join Room</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

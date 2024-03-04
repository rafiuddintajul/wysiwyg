import ColorPicker from './ColorPicker';
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent} from '../dropdown-menu';
import { Button } from '../button';
import { Palette } from 'lucide-react';

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export function DropdownColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  ...rest
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger><div className="flex text-sm mr-1 mb-1 p-1 rounded-md opacity-75 hover:bg-accent hover:opacity-100">
        <Palette size={15} className="my-auto mr-1" />Font</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ColorPicker color={color} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import ColorPicker from './ColorPicker';
import {Dropdown} from './Dropdown';
import { Button } from '../ui';
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
    <Dropdown display={<Button type="button" className="h-7 p-2"><Palette size={15} />Font</Button>}>
      <ColorPicker color={color} onChange={onChange} />
    </Dropdown>
  );
}
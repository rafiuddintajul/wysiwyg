import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection, 
  $isRangeSelection, 
} from 'lexical';
import {$patchStyleText} from "@lexical/selection"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
 } from '../../dropdown-menu';

export const FontSizePlugin = ({ dispSize, disabled=false }:{dispSize:string, disabled?:boolean }) => {
  const [editor] = useLexicalComposerContext()
  const formatFontSize = (size:string) => {
    editor.update(()=>{
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { ['font-size']: size })
      }
    })
  }

  const options = [
    { dispMenu:'12px', onClick:()=>formatFontSize('12px') },
    { dispMenu:'13px', onClick:()=>formatFontSize('13px') },
    { dispMenu:'14px', onClick:()=>formatFontSize('14px') },
    { dispMenu:'15px', onClick:()=>formatFontSize('15px') },
    { dispMenu:'16px', onClick:()=>formatFontSize('16px') },
    { dispMenu:'17px', onClick:()=>formatFontSize('17px') },
    { dispMenu:'18px', onClick:()=>formatFontSize('18px') },
    { dispMenu:'19px', onClick:()=>formatFontSize('19px') },
    { dispMenu:'20px', onClick:()=>formatFontSize('20px') },
  ]

  return <DropdownMenu>
    <DropdownMenuTrigger className="text-sm mr-1 mb-1 p-1 rounded-md opacity-75 enabled:hover:bg-accent enabled:hover:opacity-100 disabled:text-muted-foreground" disabled={disabled}>{dispSize}</DropdownMenuTrigger>
    <DropdownMenuContent>
      {
        options.map((option,i) => {
          return <DropdownMenuItem key={i} onClick={option.onClick}>{option.dispMenu}</DropdownMenuItem>
        })
      }
    </DropdownMenuContent>
  </DropdownMenu>
}
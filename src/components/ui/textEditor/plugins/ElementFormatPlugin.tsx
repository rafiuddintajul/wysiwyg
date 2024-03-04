import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const ElementFormatPlugin = ({ dispAlign }:{ dispAlign:string }) => {
  const [editor] = useLexicalComposerContext()
  const options = [
    { dispMenu: 'Left Align', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'left')} },
    { dispMenu: 'Center Align', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'center')} },
    { dispMenu: 'Right Align', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'right')} },
    { dispMenu: 'Justify', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'justify')} },
  ]
  return <DropdownMenu>
    <DropdownMenuTrigger className="text-sm mr-1 mb-1 p-1 rounded-md opacity-75 hover:bg-accent hover:opacity-100">{dispAlign}</DropdownMenuTrigger>
    <DropdownMenuContent>
      {
        options.map((item,i)=>{
          return <DropdownMenuItem key={i} onClick={item.onClick}>{item.dispMenu}</DropdownMenuItem>
        })
      }
    </DropdownMenuContent>
  </DropdownMenu>
}
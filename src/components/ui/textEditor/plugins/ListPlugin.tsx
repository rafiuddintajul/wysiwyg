import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND} from '@lexical/list';
import {List, ListOrdered, LayoutList} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
 } from '../../dropdown-menu';

export const ListPlugin = ({ blockType }: { blockType: string}) => {
  const [editor] = useLexicalComposerContext()
  
  const formatBulletList = () => {
    
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }

  const formatNumberedList = () => {
    console.log('formatNumberedList')
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }

  const options = [
    { dispMenu:<><List size={20} strokeWidth={2} className="mr-2" />Bullet</>, onClick:formatBulletList },
    { dispMenu:<><ListOrdered size={20} strokeWidth={2} className="mr-2" />Number</>, onClick:formatNumberedList }
  ]
  
  const displayButton = () => {
    if(blockType === 'bullet'){
      return <List size={15} className="my-auto" />
    } 
    if (blockType === 'number'){
      return <ListOrdered size={15} className="my-auto" />
    }
    return <LayoutList size={14} className="my-auto" />
  }

  return <DropdownMenu>
    <DropdownMenuTrigger className="text-sm mr-1 mb-1 p-1 rounded-md opacity-75 hover:bg-accent hover:opacity-100 w-7 flex justify-center">{displayButton()}</DropdownMenuTrigger>
    <DropdownMenuContent>
      {
        options.map((option,i) => {
          return <DropdownMenuItem key={i} onClick={option.onClick}>{option.dispMenu}</DropdownMenuItem>
        })
      }
    </DropdownMenuContent>
  </DropdownMenu> 
}
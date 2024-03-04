import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection, 
  $isRangeSelection, 
  $createParagraphNode,
} from 'lexical';
import {$setBlocksType} from "@lexical/selection"
import {$createHeadingNode, HeadingTagType} from '@lexical/rich-text'
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '../../dropdown-menu';

const blockTypeToBlockName = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  paragraph: 'Normal',
}

export function FormatPlugin ( { blockType }:{ blockType:string} ){
  const [editor] = useLexicalComposerContext()
  
  const formatHeading = (type:HeadingTagType) => {
    editor.update(()=>{
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, ()=> $createHeadingNode(type))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    })
  }

  const options = [
    { dispMenu: 'Heading 1', onClick:()=>formatHeading('h1') },
    { dispMenu: 'Heading 2', onClick:()=>formatHeading('h2') },
    { dispMenu: 'Heading 3', onClick:()=>formatHeading('h3') },
    { dispMenu: 'Heading 4', onClick:()=>formatHeading('h4') },
    { dispMenu: 'Normal', onClick:()=>formatParagraph()},
  ]

  const displayButton = ()=> {
    if (blockType !== 'bullet' && blockType !== 'number' ) {
      return blockTypeToBlockName[blockType as keyof typeof blockTypeToBlockName]
    }
    return 'Normal'
  }

  return <DropdownMenu>
    <DropdownMenuTrigger className="text-sm mr-1 mb-1 p-1 rounded-md opacity-75 hover:bg-accent hover:opacity-100" >{displayButton()}</DropdownMenuTrigger>
    <DropdownMenuContent>
      {
        options.map((option,i) => {
          return <DropdownMenuItem key={i} onClick={option.onClick}>{option.dispMenu}</DropdownMenuItem>
        })
      }
    </DropdownMenuContent>
  </DropdownMenu>
}
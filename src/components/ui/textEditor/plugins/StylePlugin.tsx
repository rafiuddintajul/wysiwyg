import { useState, useEffect } from "react"
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,  
} from 'lexical';
import { Toggle } from "../../toggle";
import { Bold, Italic, Underline } from 'lucide-react';

export const StylePlugin = ({ fontType }:{ fontType: { bold:boolean, italic:boolean, underline:boolean } }) => {
  const [editor] = useLexicalComposerContext()
  const [fontTypeState, setFontTypeState ] = useState(fontType)
  const [style, setStyle] = useState()
  useEffect(()=>{
    setFontTypeState(fontType)
  },[fontType])

  const boldHandler = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
    setFontTypeState({ ...fontTypeState, bold:!fontTypeState.bold })
  }
  const italicHandler = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
    setFontTypeState({ ...fontTypeState, italic:!fontTypeState.italic })
  }
  const underlineHandler = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
    setFontTypeState({ ...fontTypeState, underline:!fontTypeState.underline })
  }

  const defaultClass = "h-full w-7 p-0 text-muted-foreground hover:bg-accent data-[state=on]:text-primary data-[state=on]:bg-transparent data-[state=on]:hover:bg-accent"

  return <div className="flex h-7 mr-1 mb-1">
    <Toggle pressed={fontTypeState.bold}  className={defaultClass} onClick={boldHandler}><Bold size={12} /></Toggle>
    <Toggle pressed={fontTypeState.italic} className={defaultClass} onClick={italicHandler}><Italic size={12} /></Toggle>
    <Toggle pressed={fontTypeState.underline} className={defaultClass} onClick={underlineHandler}><Underline size={12} /></Toggle>
  </div>
}

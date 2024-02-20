
'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { Button } from '../ui';
import { TextEditorToolbarPlugin } from './TextEditorToolbarPlugin';
import { createEditor } from 'lexical';
import { useRef, useState } from 'react';

type Theme = {
  [key:string]:any,
}

type TextEditorProps = {
  namespace:string,
  state?:string,
  editable?:boolean,
  theme?:Theme,
  onError?:(error:any)=>void,
  onSave?:(content:string)=>void,
  loading?:boolean,
  editableClassName?:string,
}

const defaultTheme = {
  text: {
    bold:'font-bold',
    italic:'italic',
    underline: 'underline underline-offset-2',
  }
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function defaultOnError(error:any) {
  console.error(error);
}

function SavePlugin({ onSave, loading, customClass }:{onSave?:(state:string)=>void, loading?:boolean, customClass?:string}){
  const [editor] = useLexicalComposerContext()
  if (onSave) {
    return <Button type="button" className={"h-7 w-auto absolute -bottom-7 "+ customClass} onClick={()=>onSave(JSON.stringify(editor.getEditorState().toJSON()))} disabled={loading}>Save</Button>
  }
}

const defaultState = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'

export const TextEditor = ({ namespace, state=defaultState, editable=true, theme=defaultTheme, onError=defaultOnError, onSave, loading, editableClassName}:TextEditorProps) => {
  const [hideToolbar, setHideToolbar] = useState(true)
  const inputRef = useRef<HTMLDivElement>(null)
  const isValidState = () => {
    // Just to test if the state passed is valid or the component will only render error text node
    try {
      const config = {
        nodes: [ HeadingNode, ListItemNode, ListNode ]
      }
      const editor = createEditor(config)
      const editorState = editor.parseEditorState(state)
      return true
    } catch (error) {
      return false
    }    
  }

  const initialConfig = {
    editable:editable,
    editorState:state,
    namespace: namespace,
    theme,
    onError,
    nodes: [ HeadingNode, ListItemNode, ListNode ]
  }

  const hiddenToolbar = hideToolbar ? "hidden group-hover/textEditor:flex group-active/textEditor:flex" : "flex"

  if (isValidState()) {
    return (
      <div className="max-h-full relative group/textEditor" onFocus={()=>setHideToolbar(false)} onBlur={()=>setHideToolbar(true)} ref={inputRef} onClick={(e)=>e.stopPropagation()} >
        <LexicalComposer initialConfig={initialConfig}>
          {editable ? <TextEditorToolbarPlugin customClass={hiddenToolbar} /> : ''}
          <div className="relative" >
            <RichTextPlugin
              contentEditable={<ContentEditable className={"flex-1 border border-gray-500 rounded-md py-1 px-2 mb-1 overflow-scroll scrollbar-hide "+editableClassName} />}
              placeholder={<div className="absolute top-0 py-1 px-2 text-gray-300 mb-1 z-0 placeholder">Enter some text...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <ListPlugin />
          <HistoryPlugin />
          {editable ? <SavePlugin onSave={onSave} loading={loading} customClass={hiddenToolbar} /> : ''}
        </LexicalComposer>
      </div>
    )
  }
  return <div><h3>Error:Invalid Editor State</h3></div>  
}
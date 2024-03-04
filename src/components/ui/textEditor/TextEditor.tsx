
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
import { Button } from '../button';
import { TextEditorToolbarPlugin } from './TextEditorToolbarPlugin';
import { $getRoot, $insertNodes } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import './TextEditor.css';

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

export const defaultTheme = {
  text: {
    bold:'font-bold',
    italic:'italic',
    underline: 'underline underline-offset-2',
  },
  list: {
    ol: 'list-inside list-disc',
    ul: 'list-inside list-decimal',
  }
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function defaultOnError(error:any) {
  console.error(error);
}

function SavePlugin({ onSave, loading, hidden=false }:{onSave?:(state:any)=>void, loading?:boolean, hidden?:boolean }){
  const [editor] = useLexicalComposerContext()
  const hideButton = hidden ? 'hidden' : 'block'
  
  const saveHandler = (e:React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    editor.update(()=>{
      const htmlString = $generateHtmlFromNodes(editor, null)
      onSave && onSave(htmlString);
    })
  }

  return <Button type="button" className={`${hideButton} group-hover/textEditor:flex absolute -bottom-7 h-7 text-xs w-auto`} onClick={saveHandler} disabled={loading}>Save</Button>
}

function UpdateStatePlugin({ data }:{ data:string|undefined }){
  const [editor] = useLexicalComposerContext();
  useEffect(()=>{
    
    if (data) {
      const parser = new DOMParser();
      const dom = parser.parseFromString(data,'text/html');

      editor.update(()=>{
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot()
        root.clear()
        $insertNodes(nodes)
      })
      
    }
  },[data, editor])
  
  return null
}

export const TextEditor = ({ namespace, state=undefined, editable=true, theme=defaultTheme, onError=defaultOnError, onSave, loading, editableClassName}:TextEditorProps) => {
  const [hideToolbar, setHideToolbar] = useState(true)
  const inputRef = useRef<HTMLDivElement>(null)

  const initialConfig = {
    editable:editable,
    namespace: namespace,
    theme,
    onError,
    nodes: [ HeadingNode, ListItemNode, ListNode ]
  }

  return (
    <div className="h-full relative group/textEditor" ref={inputRef} onFocus={()=>setHideToolbar(false)} onBlur={()=>setHideToolbar(true)} >
      <LexicalComposer initialConfig={initialConfig}>
        <UpdateStatePlugin data={state} />
        <TextEditorToolbarPlugin hidden={hideToolbar} />
        <div className="relative h-full" >
          <RichTextPlugin
            contentEditable={<ContentEditable disabled={loading} className={"flex-1 border border-gray-500 h-full rounded-md py-1 px-2 mb-1 overflow-scroll content-editable "+editableClassName} />}
            placeholder={<div className="absolute top-0 py-1 px-2 text-gray-300 mb-1 z-0 pointer-events-none">Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <ListPlugin />
        <HistoryPlugin />
        <SavePlugin onSave={onSave} loading={loading} hidden={hideToolbar} />
      </LexicalComposer>
    </div>
  )
}
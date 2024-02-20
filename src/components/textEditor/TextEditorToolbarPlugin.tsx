'use client'

import React, { useState, useEffect } from 'react';
import { Dropdown } from './Dropdown';
import { DropdownColorPicker } from './DropDownColorPicker';
import {
  $getSelection, 
  $isRangeSelection, 
  $isRootOrShadowRoot, 
  $createParagraphNode, 
  SELECTION_CHANGE_COMMAND, 
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,  
  FORMAT_ELEMENT_COMMAND,
  ElementNode,
  RangeSelection,
  TextNode,
  $isElementNode,
} from 'lexical';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$findMatchingParent, $getNearestNodeOfType} from '@lexical/utils'
import {$isListNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND} from '@lexical/list'
import {$setBlocksType, $patchStyleText, $getSelectionStyleValueForProperty, $isAtNodeEnd } from "@lexical/selection"
import {$createHeadingNode, $isHeadingNode, HeadingTagType} from '@lexical/rich-text'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { Button } from '../ui';
import { useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, LayoutList } from 'lucide-react';
import { Toggle } from '../ui'

const blockTypeToBlockName = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  paragraph: 'Normal',
}
// utility function
export function getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

// Individual Plugin
function FormatPlugin ( { blockType }:{ blockType:string} ){
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

  return <Dropdown display={<Button type="button" className="h-7 min-w-[120px] overflow-hidden">{displayButton()}</Button>} options={options} />
}

const StylePlugin = ({ fontType }:{ fontType: { bold:boolean, italic:boolean, underline:boolean } }) => {
  const [editor] = useLexicalComposerContext()
  const [ fontTypeState, setFontTypeState ] = useState(fontType)
  
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
  return <div className="flex gap-1 h-7">
    <Toggle pressed={fontTypeState.bold} className="h-full p-2 bg-primary transition-colors text-primary-foreground" onClick={boldHandler}><Bold size={12} /></Toggle>
    <Toggle pressed={fontTypeState.italic} className="h-full p-2 bg-primary transition-colors text-primary-foreground" onClick={italicHandler}><Italic size={12} /></Toggle>
    <Toggle pressed={fontTypeState.underline} className="h-full p-2 bg-primary transition-colors text-primary-foreground" onClick={underlineHandler}><Underline size={12} /></Toggle>
  </div>
}

const ListPlugin = ({ blockType }: { blockType: string}) => {
  const [editor] = useLexicalComposerContext()
  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }

  const formatNumberedList = () => {
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
      return <List size={15} />
    } 
    if (blockType === 'number'){
      return <ListOrdered size={15} />
    }
    return <LayoutList size={14} />
  }
  return <Dropdown display={<Button type="button" className="h-7 px-2">{displayButton()}</Button>} options={options} />  
}

const FontSizePlugins = ({ dispSize }:{dispSize:string}) => {
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

  return <Dropdown display={<Button type="button" className="h-7 px-2">{dispSize}</Button>} options={options} />
}

const ElementFormatPlugin = ({ dispAlign }:{ dispAlign:string }) => {
  const [editor] = useLexicalComposerContext()
  const options = [
    { dispMenu: 'Left Align', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'left')} },
    { dispMenu: 'Center Align', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'center')} },
    { dispMenu: 'Right Align', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'right')} },
    { dispMenu: 'Justify', onClick:()=>{editor.dispatchCommand(FORMAT_ELEMENT_COMMAND,'justify')} },
  ]
  return <Dropdown display={<Button type="button" className="h-7 px-2">{dispAlign}</Button>} options={options} />
}

export const TextEditorToolbarPlugin = ({ customClass }:{ customClass?:string }) => {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [blockType, setBlockType] = useState('paragraph')
  const [fontSize, setFontSize] = useState('16px')
  const [fontFormat, setfontFormat] = useState({ bold:false, italic:false, underline:false })
  const [elementFormat, setElementFormat] = useState('Left Align')
	const [fontColor, setFontColor] = useState<string>('#000');

  const $updateToolbar = useCallback(()=>{
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Attempt to get selected node parent (not text node)
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element !== null) {
        // Selection's block type & font size
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type)
          const font = $getSelectionStyleValueForProperty(selection, 'font-size', '15px') 
          setFontSize(font ? font : 'mixed')
        }
      }
      // Selection's bold, italic, underline
      setfontFormat({ bold:selection.hasFormat('bold'), italic:selection.hasFormat('italic'), underline:selection.hasFormat('underline') })
      // Selection's Alignment
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }
      const align = $isElementNode(matchingParent)
      ? matchingParent.getFormatType()
      : $isElementNode(node)
      ? node.getFormatType()
      : parent?.getFormatType() || 'left'
      setElementFormat(`${!!align ? align.charAt(0).toUpperCase() + align.slice(1) : 'Left' } Align`)

      // Selection's Font Color
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      )
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeEditor])

  useEffect(() => {
    // run the $updateToolbar accordingly everytime textarea selected. This makes headings plugin to change appearance depending of selected node format
    // this function need a little bit of study
    return editor.registerCommand(
      // this function to register an event listener
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? {tag: 'historic'} : {},
      );
    },
    [activeEditor],
  )
	
	const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({color: value}, skipHistoryStack);
    },
    [applyStyleText],
  )

  return (
    <div className={"z-50 absolute md:-top-9 flex flex-wrap gap-1 my-1 -top-64 "+customClass}>
      <FormatPlugin blockType={blockType} />
      <ListPlugin blockType={blockType} />
      <StylePlugin fontType={fontFormat} />
      <FontSizePlugins dispSize={fontSize} />
      <ElementFormatPlugin dispAlign={elementFormat} />
			<DropdownColorPicker buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting text color"
            buttonIconClassName="icon font-color"
            color={fontColor}
            onChange={onFontColorSelect}
			/>
    </div>
  )
}

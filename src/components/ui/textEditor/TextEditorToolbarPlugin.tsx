'use client'

import React, { useState, useEffect } from 'react';
import { DropdownColorPicker } from '../colorPicker/DropDownColorPicker';
import {
  $getSelection, 
  $isRangeSelection, 
  $isRootOrShadowRoot, 
  SELECTION_CHANGE_COMMAND, 
  COMMAND_PRIORITY_CRITICAL,
  ElementNode,
  RangeSelection,
  TextNode,
  $isElementNode,
} from 'lexical';
import {$isLinkNode} from '@lexical/link';
import {$findMatchingParent, $getNearestNodeOfType} from '@lexical/utils'
import {$isListNode, ListNode} from '@lexical/list'
import {$patchStyleText, $getSelectionStyleValueForProperty, $isAtNodeEnd } from "@lexical/selection"
import {$isHeadingNode} from '@lexical/rich-text'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { FormatPlugin, ListPlugin, FontSizePlugin, ElementFormatPlugin, StylePlugin } from './plugins'

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

export const TextEditorToolbarPlugin = ({ hidden=false }:{ hidden?:boolean }) => {
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

  const hideToolbar = hidden ? 'hidden ' : 'flex'

  return (
    <div className={`${hideToolbar} absolute -top-9 h-9 w-full group-hover/textEditor:flex`} onClick={(e)=>{e.preventDefault();e.stopPropagation()}} >
      <div className="relative h-full w-full">
        <div className="absolute bottom-0 w-full flex flex-wrap px-1 pt-1 bg-muted rounded-md">
          <FormatPlugin blockType={blockType} />
          <ListPlugin blockType={blockType} />
          <StylePlugin fontType={fontFormat} />
          <FontSizePlugin dispSize={fontSize} disabled={blockType!=='paragraph'}/>
          <ElementFormatPlugin dispAlign={elementFormat} />
          <DropdownColorPicker buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting text color"
            buttonIconClassName="icon font-color"
            color={fontColor}
            onChange={onFontColorSelect}
          />
        </div>
      </div>
    </div>
  )
}


import React from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { EditorState, useEditorState } from '../editor/EditorContext';
import OrderedListIcon from './icons/OrderedListIcon';
import UnorderedListIcon from './icons/UnorderedListIcon';
import BoldButton from './icons/BoldButton';
import ItalicButton from './icons/ItalicButton';
import UnderLIneButton from './icons/UnderLIneButton';
import AlignLeft from './icons/AlignLeft';
import AlignCenter from './icons/AlignCenter';
import AlignRight from './icons/AlignRight';

export const BtnBold = createButton('Bold', <BoldButton/>, 'bold');

export const BtnBulletList = createButton(
  'Bullet list',
  <UnorderedListIcon />,
  'insertUnorderedList',
);
export const BtnAligenLeft = createButton('Aligen left', <AlignLeft/> , 'justifyLeft');
export const BtnAlignCenter = createButton('Align center', <AlignCenter/>, 'justifyCenter');
export const BtnAlignRight = createButton('Aligen right', <AlignRight/> ,'justifyRight');
// const toolbar = document.querySelector('.toolbar');



export const BtnClearFormatting = createButton(
  'Clear formatting',
  'T̲ₓ',
  'removeFormat',
);

export const BtnItalic = createButton('Italic', <ItalicButton/>, 'italic');

export const BtnStrikeThrough = createButton(
  'Strike through',
  <s>ab</s>,
  'strikeThrough',
);

export const BtnLink = createButton('Link', '🔗', ({ $selection }) => {
  if ($selection?.nodeName === 'A') {
    document.execCommand('unlink');
  } else {
    // eslint-disable-next-line no-alert
    document.execCommand('createLink', false, prompt('URL', '') || undefined);
  }
});

export const BtnNumberedList = createButton(
  'Numbered list',
  <OrderedListIcon />,
  'insertOrderedList',
);

export const BtnRedo = createButton('Redo', '↷', 'redo');

export const BtnUnderline = createButton(
  'Underline',
  <UnderLIneButton/>,
  'underline',
);

export const BtnUndo = createButton('Undo', '↶', 'undo');

function findListElement(node: Node): HTMLElement | null {
  let currentElement: Node | null = node;
  while (currentElement) {
    if (currentElement.nodeType === Node.ELEMENT_NODE && (currentElement as HTMLElement).tagName.toLowerCase() === 'ul' || (currentElement as HTMLElement).tagName.toLowerCase() === 'ol') {
      return currentElement as HTMLElement;
    }
    currentElement = currentElement.parentNode;
  }
  return null;
}

export function createButton(
  title: string,
  content: ReactNode,
  command: ((state: EditorState) => void) | string,
) {
  ButtonFactory.displayName = title.replace(/\s/g, '');

  return ButtonFactory;

  function ButtonFactory(props: HTMLAttributes<HTMLButtonElement>) {
    const editorState = useEditorState();
    const { $el, $selection } = editorState;
    let active = false;
    if (typeof command === 'string') {
      active = !!$selection && document.queryCommandState(command);
    }

    function onAction(e: MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      if (document.activeElement !== $el) {
        $el?.focus();
      }

      if (typeof command === 'function') {
        command(editorState);
      } else {
        if((command === 'justifyCenter' || command === 'justifyLeft' || command ==='justifyRight') === false){
          document.execCommand(command)
        }
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const parentElement = range.commonAncestorContainer.parentElement;
          if(command === 'justifyCenter'){
            if (parentElement) {
              if(parentElement.tagName.toLowerCase() === 'div'){
                document.execCommand(command)
              }
              let listElement = findListElement(parentElement);
              if (!listElement && parentElement.tagName.toLowerCase() === 'li') {
                listElement = findListElement(range.commonAncestorContainer);
              }
              if (listElement) {
                listElement.style.display = 'flex';
                listElement.style.flexDirection= 'column'
                listElement.style.alignItems=''
                listElement.style.width = '95%'
                listElement.style.marginLeft = '50%'
                listElement.style.marginRight = '50%'
              }
              
            }
          } 
          else if(command === 'justifyLeft'){
            if (parentElement) {
              if(parentElement.tagName.toLowerCase() === 'div'){
                document.execCommand(command)
              }
              let listElement = findListElement(parentElement);
              if (!listElement && parentElement.tagName.toLowerCase() === 'li') {
                listElement = findListElement(range.commonAncestorContainer);
              }
              if (listElement) {
                // if(listElement.tagName.toLowerCase() === 'ul' || 'ol'){
                //   if(parentElement.tagName.toLowerCase() === 'li'){
                //     parentElement.style.textAlign=''
                //   }
                // }
                listElement.style.display = 'flex';
                listElement.style.flexDirection= 'column'
                listElement.style.alignItems='start'
                listElement.style.width = ''
                listElement.style.marginLeft = ''
                listElement.style.marginRight = ''
              }
              
            }
          }
          else if(command === 'justifyRight'){
            if (parentElement) {
              if(parentElement.tagName.toLowerCase() === 'div'){
                document.execCommand(command)
              }
              let listElement = findListElement(parentElement);
              if (!listElement && parentElement.tagName.toLowerCase() === 'li') {
                listElement = findListElement(range.commonAncestorContainer);
              }
              if (listElement) {
                // if(listElement.tagName.toLowerCase() === 'ul' || 'ol'){
                //   if(parentElement.tagName.toLowerCase() === 'li'){
                //     parentElement.style.textAlign=''
                //   }
                // }
                listElement.style.display = 'flex';
                listElement.style.flexDirection= 'column'
                listElement.style.alignItems='end'
                listElement.style.width = ''
                listElement.style.marginLeft = ''
                listElement.style.marginRight = ''
              }
              
            }
          }
          
          // if (parentElement) {
          //   if(command === 'justifyCenter'){
          //     parentElement.style.textAlign = 'center';
          //     parentElement.style.display = 'flex'
          //     parentElement.style.justifyContent = 'center'
          //   }
            
          // }
        }
      }
    }
    if (editorState.htmlMode) {
      return null;
    }

    return (
      <button
        type="button"
        title={title}
        {...props}
        className="rsw-btn"
        onMouseDown={onAction}
        data-active={active}
      >
        {content}
      </button>
    );
  }
}

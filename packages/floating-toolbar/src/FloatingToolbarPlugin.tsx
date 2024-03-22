import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToolbar } from "@lexiwind/toolbar";
import { useFloatingPosition } from './useFloatingPosition';

export interface FloatingToolbarPluginProps {
  portalTarget?: Element;
  showLink?: boolean;
  onLinkClick?: (currentUrl: string) => void;
}

interface FormatButtonProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

function FormatButton({
  onMouseDown,
  isActive,
  title,
  children,
}: FormatButtonProps): JSX.Element {
  return (
    <button
      onMouseDown={onMouseDown}
      title={title}
      aria-pressed={isActive}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        transition: "background 0.15s",
        background: isActive ? "#3b82f6" : "transparent",
        color: isActive ? "#fff" : "inherit",
      }}
    >
      {children}
    </button>
  );
}

export function FloatingToolbarPlugin({
  portalTarget,
  showLink = true,
  onLinkClick,
}: FloatingToolbarPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const toolbar = useToolbar();
  const { position, updatePosition, clearPosition, floatingRef } =
    useFloatingPosition();
  const [isVisible, setIsVisible] = useState(false);
  const mouseDownRef = useRef(false);

  const updateVisibility = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        updatePosition();
        setIsVisible(true);
      } else {
        clearPosition();
        setIsVisible(false);
      }
    });
  }, [editor, updatePosition, clearPosition]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateVisibility();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || selection.isCollapsed()) {
            if (!mouseDownRef.current) {
              clearPosition();
              setIsVisible(false);
            }
          }
        });
      })
    );
  }, [editor, updateVisibility, clearPosition]);

  useEffect(() => {
    const onMouseDown = () => {
      mouseDownRef.current = true;
    };
    const onMouseUp = () => {
      mouseDownRef.current = false;
      updateVisibility();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [updateVisibility]);

  if (!isVisible || !position) return null;

  const handleMouseDown = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    fn();
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLinkClick) {
      onLinkClick(toolbar.linkUrl ?? "");
    } else {
      toolbar.toggleLink(toolbar.isLink ? null : "https://");
    }
  };

  const content = (
    <div
      ref={floatingRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "4px 6px",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        userSelect: "none",
      }}
    >
      <FormatButton
        onMouseDown={handleMouseDown(() => toolbar.toggleBold())}
        isActive={toolbar.isBold}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </FormatButton>
      <FormatButton
        onMouseDown={handleMouseDown(() => toolbar.toggleItalic())}
        isActive={toolbar.isItalic}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </FormatButton>
      <FormatButton
        onMouseDown={handleMouseDown(() => toolbar.toggleUnderline())}
        isActive={toolbar.isUnderline}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </FormatButton>
      <FormatButton
        onMouseDown={handleMouseDown(() => toolbar.toggleStrikethrough())}
        isActive={toolbar.isStrikethrough}
        title="Strikethrough"
      >
        <s>S</s>
      </FormatButton>
      <FormatButton
        onMouseDown={handleMouseDown(() => toolbar.toggleCode())}
        isActive={toolbar.isCode}
        title="Inline code"
      >
        {"</>"}
      </FormatButton>
      {showLink && (
        <FormatButton
          onMouseDown={handleLinkClick}
          isActive={toolbar.isLink}
          title="Link (Ctrl+K)"
        >
          🔗
        </FormatButton>
      )}
    </div>
  );

  return createPortal(content, portalTarget ?? document.body);
}

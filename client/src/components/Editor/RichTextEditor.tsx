import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Highlighter } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize and update contentEditable innerHTML only if it differs from parent state
  // to avoid cursor resetting to the beginning of the line on every keystroke.
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If the field is completely empty, it might contain a <br> tag. Clean it up.
      if (html === '<br>' || html === '') {
        onChange('');
      } else {
        onChange(html);
      }
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden text-start">
      {/* Editor Formatting Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 bg-slate-100/70 border-b border-slate-200/80 select-none">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('hiliteColor', '#fef08a')} // Tailwind yellow-200 hex
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Highlight Selection"
        >
          <Highlighter className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ContentEditable Text Workspace */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        className={`w-full px-3 py-2 text-xs text-slate-800 outline-none leading-relaxed text-start min-h-[80px] bg-transparent ${className}`}
        style={{
          height: `${rows * 20}px`,
          overflowY: 'auto'
        }}
        data-placeholder={placeholder}
      />

      {/* Styled Placeholder CSS via custom inline styles */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8; /* slate-400 */
          cursor: text;
        }
      `}</style>
    </div>
  );
};
export default RichTextEditor;

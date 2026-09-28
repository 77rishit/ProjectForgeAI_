import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

export interface ChatComposerProps {
  placeholder?: string;
  onSend: (message: string) => void;
  className?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  placeholder = 'Type your message...',
  onSend,
  className = ''
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 border-t border-[var(--border-subtle)] bg-[#0B0D16] flex items-center gap-3 ${className}`}
    >
      <div className="flex items-center gap-1.5 shrink-0 text-[var(--text-dim)]">
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          title="Add emoji"
        >
          <Smile className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none focus:border-indigo-500/50"
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className="h-11 px-4 sm:px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer shrink-0"
      >
        <span>Send</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};

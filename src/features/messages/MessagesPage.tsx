import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Info,
  ChevronLeft,
  MoreVertical,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/ui/Avatar';
import { ConversationList, ConversationItem } from '../../components/ui/ConversationList';
import { MessageBubble } from '../../components/ui/MessageBubble';
import { ChatComposer } from '../../components/ui/ChatComposer';
import { messageService } from '../../services/messageService';
import { ChatMessage } from '../../types';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const userName = user?.name || 'Rishit Patel';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeConvId, setActiveConvId] = useState<string>('c1');
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'c1',
      name: 'ProjectForge Core Team',
      lastMessage: 'Rohan: Finished PR #42 for auth guards',
      time: '12:45 PM',
      unreadCount: 0,
      isOnline: true
    },
    {
      id: 'c2',
      name: 'Faculty Advisor',
      lastMessage: 'Dr. Elena: Rubric review scheduled for Friday',
      time: 'Yesterday',
      unreadCount: 0,
      isOnline: true
    },
    {
      id: 'c3',
      name: 'Priya Sharma',
      lastMessage: 'Priya: Vector DB indexing completed',
      time: 'Sep 24',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'c4',
      name: 'Arjun Mehta',
      lastMessage: 'Arjun: Shared Figma system specs',
      time: 'Sep 21',
      unreadCount: 0,
      isOnline: true
    }
  ]);

  // Load conversations on mount
  useEffect(() => {
    async function loadConvos() {
      try {
        const convos = await messageService.getConversations();
        if (convos && convos.length > 0) {
          setConversations(convos);
        }
      } catch (err) {
        console.error('Failed to load conversations from backend:', err);
      }
    }
    loadConvos();
  }, []);

  // Fetch messages from MongoDB for current active conversation
  useEffect(() => {
    let isCurrent = true;
    async function loadMessages() {
      setLoading(true);
      try {
        const data = await messageService.getMessages(activeConvId);
        if (isCurrent) {
          setMessages(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch messages for channel:', err);
        toast.error('Unable to load channel messages from database.');
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    loadMessages();
    return () => {
      isCurrent = false;
    };
  }, [activeConvId]);

  // Auto-scroll on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setMobileThreadOpen(true);

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      const savedMsg = await messageService.sendMessage(activeConvId, content.trim());
      setMessages((prev) => [...prev, savedMsg]);

      // Update last message in the left conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: `You: ${content.trim()}`, time: 'Just now' }
            : c
        )
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message to database');
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col flex-1 overflow-hidden">
      {/* Messages Header Bar */}
      <div className="px-6 py-3.5 border-b border-[var(--border-subtle)] bg-[#080A12] shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Messages</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Real-time workspace collaboration, peer discussions, and faculty mentorship.
        </p>
      </div>

      {/* Main Split Layout: Left 320px + Right Workspace */}
      <div className="flex-1 flex overflow-hidden border border-[var(--border-subtle)] sm:rounded-2xl sm:m-4 sm:mt-2 bg-[#10131F]">
        {/* LEFT: Conversation sidebar (~320px) */}
        <div
          className={`${
            mobileThreadOpen ? 'hidden md:flex' : 'flex'
          } w-full md:w-[320px] shrink-0 flex-col h-full border-r border-[var(--border-subtle)] bg-[#0B0D16]`}
        >
          <ConversationList
            conversations={filteredConversations}
            activeId={activeConvId}
            onSelect={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* RIGHT: Conversation Workspace (Remaining Width) */}
        <div
          className={`${
            !mobileThreadOpen ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col h-full bg-[#10131F] min-w-0`}
        >
          {/* Conversation Workspace Header */}
          <div className="h-16 px-5 border-b border-[var(--border-subtle)] bg-[#0B0D16]/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileThreadOpen(false)}
                className="md:hidden p-1.5 -ml-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 cursor-pointer"
                aria-label="Back to conversations"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <Avatar name={activeConv.name} src={activeConv.avatar} size="md" />
                {activeConv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0D16]" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {activeConv.name}
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeConv.id === 'c1'
                    ? 'Active Workspace Channel'
                    : activeConv.isOnline
                    ? 'Online · Direct Message'
                    : 'Offline · Last seen recently'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 text-[var(--text-dim)]">
              <button
                title="Voice Call"
                className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                title="Video Meeting"
                className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                title="Thread Info"
                className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                title="More Options"
                className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
            <div className="text-center my-1">
              <span className="text-[11px] font-mono text-[var(--text-dim)] px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                Today · Database Synchronized Channel
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs font-mono text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Loading messages from database...</span>
              </div>
            ) : (
              messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  id={m.id}
                  sender={m.sender}
                  senderRole={m.senderRole}
                  avatar={m.avatar}
                  content={m.content}
                  time={m.time}
                  isMe={m.isMe}
                />
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer (Fixed to bottom of conversation panel) */}
          <ChatComposer
            placeholder={`Message ${activeConv.name}...`}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

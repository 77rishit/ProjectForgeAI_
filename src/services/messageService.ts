import { api } from './api';
import { ChatMessage } from '../types';
import { ConversationItem } from '../components/ui/ConversationList';

export const messageService = {
  async getConversations(): Promise<ConversationItem[]> {
    const res = await api.get<{ conversations: ConversationItem[] }>('/messages/conversations');
    return res.conversations;
  },

  async getMessages(channelId: string): Promise<ChatMessage[]> {
    const res = await api.get<{ messages: ChatMessage[] }>(`/messages/${channelId}`);
    return res.messages;
  },

  async sendMessage(channelId: string, content: string): Promise<ChatMessage> {
    const res = await api.post<{ message: ChatMessage }>(`/messages/${channelId}`, { content });
    return res.message;
  }
};

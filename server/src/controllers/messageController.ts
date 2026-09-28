import { Response } from 'express';
import mongoose from 'mongoose';
import { Message, IMessage } from '../models/Message.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';

const INITIAL_CHANNEL_SEEDS: Record<string, Array<{ senderName: string; senderRole: string; content: string; time: string; isMe?: boolean }>> = {
  c1: [
    {
      senderName: 'Dr. Elena Vance',
      senderRole: 'Faculty Advisor',
      content: 'Team, please ensure your architectural blueprint includes database indexing strategies before the mid-term defense.',
      time: '10:14 AM'
    },
    {
      senderName: 'Rohan Kumar',
      senderRole: 'Full Stack',
      content: 'Understood Dr. Elena! I have integrated MongoDB compound indexes for task queries and team match scoring.',
      time: '10:48 AM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'All frontend components are now aligned with the updated dark surfaces and typography hierarchy. Preparing sprint demo.',
      time: '12:30 PM',
      isMe: true
    },
    {
      senderName: 'Rohan Kumar',
      senderRole: 'Full Stack',
      content: 'Finished PR #42 for auth guards. Ready for review when you have a moment!',
      time: '12:45 PM'
    }
  ],
  c2: [
    {
      senderName: 'Dr. Elena Vance',
      senderRole: 'Faculty Advisor',
      content: 'Hello Rishit, I reviewed your team’s Sprint 2 deliverables. The architecture design and project lifecycle flow look very comprehensive.',
      time: 'Yesterday 3:15 PM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'Thank you Dr. Elena! We also linked the AI recommendation logic to verified student skills and domain preferences.',
      time: 'Yesterday 4:02 PM',
      isMe: true
    },
    {
      senderName: 'Dr. Elena Vance',
      senderRole: 'Faculty Advisor',
      content: 'Excellent. Let’s schedule the formal rubric evaluation for Friday at 2:00 PM. Please have the sandbox demonstration ready.',
      time: 'Yesterday 5:30 PM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'Confirmed! The sandbox environment is deployed and all seed data is loaded. See you on Friday!',
      time: 'Yesterday 5:45 PM',
      isMe: true
    }
  ],
  c3: [
    {
      senderName: 'Priya Sharma',
      senderRole: 'Backend & Data Engineer',
      content: 'Hey Rishit! Just finished configuring the vector embeddings for the student teammate matching pipeline.',
      time: 'Sep 24 2:10 PM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'Awesome work Priya! What cosine similarity threshold did you settle on for high confidence matches?',
      time: 'Sep 24 2:25 PM',
      isMe: true
    },
    {
      senderName: 'Priya Sharma',
      senderRole: 'Backend & Data Engineer',
      content: 'We settled on 0.85+ for top tier compatibility highlights. Vector DB indexing completed and verified across 500+ student profiles.',
      time: 'Sep 24 2:40 PM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'Super clean. I will connect the UI recommendation cards to that endpoint right away.',
      time: 'Sep 24 3:00 PM',
      isMe: true
    }
  ],
  c4: [
    {
      senderName: 'Arjun Mehta',
      senderRole: 'Product Designer',
      content: 'Hey Rishit, I updated the Figma tokens for the dark editorial theme.',
      time: 'Sep 21 11:20 AM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'Saw the new tokens! Love the deep midnight base #080A12 and the electric indigo highlights.',
      time: 'Sep 21 11:45 AM',
      isMe: true
    },
    {
      senderName: 'Arjun Mehta',
      senderRole: 'Product Designer',
      content: 'Shared Figma system specs with the new button states, timeline nodes, and badge styles. Check the file whenever you are ready.',
      time: 'Sep 21 12:15 PM'
    },
    {
      senderName: 'Rishit Patel',
      senderRole: 'Team Lead',
      content: 'Implementing them now across the dashboard and task boards. Thanks Arjun!',
      time: 'Sep 21 1:10 PM',
      isMe: true
    }
  ]
};

export async function getMessagesByChannel(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { channelId } = req.params;
    const currentUserId = req.user?._id?.toString();

    let messages = await Message.find({ channelId }).sort({ createdAt: 1 });

    // Seed channel if empty
    if (messages.length === 0 && INITIAL_CHANNEL_SEEDS[channelId]) {
      const seedItems = INITIAL_CHANNEL_SEEDS[channelId];
      const docsToInsert = seedItems.map((item) => ({
        channelId,
        sender: item.isMe && req.user ? req.user._id : new mongoose.Types.ObjectId(),
        senderName: item.isMe && req.user?.name ? req.user.name : item.senderName,
        senderRole: item.senderRole,
        content: item.content,
        time: item.time,
        read: true,
        isMe: Boolean(item.isMe)
      }));

      messages = await Message.insertMany(docsToInsert);
    }

    const formattedMessages = messages.map((m) => {
      const isMe =
        m.isMe === true ||
        (Boolean(currentUserId) &&
          m.sender?.toString() === currentUserId &&
          (m.senderName === req.user?.name || m.senderName === 'You' || m.senderName === 'Rishit Patel'));

      return {
        id: m._id.toString(),
        sender: isMe ? (req.user?.name || m.senderName) : m.senderName,
        senderRole: isMe ? (req.user?.preferredRole || m.senderRole) : m.senderRole,
        avatar: m.avatar,
        content: m.content,
        time: m.time || new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe
      };
    });

    ApiResponse.success(res, { messages: formattedMessages });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching channel messages', 500);
  }
}

export async function sendMessage(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { channelId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      ApiResponse.error(res, 'Message content is required', 400);
      return;
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = new Message({
      channelId,
      sender: req.user._id,
      senderName: req.user.name || 'You',
      senderRole: req.user.preferredRole || 'Team Lead',
      avatar: req.user.profileImage || '',
      content: content.trim(),
      time: timeFormatted,
      read: true,
      isMe: true
    });

    await newMsg.save();

    ApiResponse.created(
      res,
      {
        message: {
          id: newMsg._id.toString(),
          sender: newMsg.senderName,
          senderRole: newMsg.senderRole,
          avatar: newMsg.avatar,
          content: newMsg.content,
          time: newMsg.time,
          isMe: true
        }
      },
      'Message sent and persisted'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error sending message', 500);
  }
}

export async function getConversations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const defaultChannels = [
      { id: 'c1', name: 'ProjectForge Core Team', isOnline: true },
      { id: 'c2', name: 'Faculty Advisor', isOnline: true },
      { id: 'c3', name: 'Priya Sharma', isOnline: false },
      { id: 'c4', name: 'Arjun Mehta', isOnline: true }
    ];

    const conversations = await Promise.all(
      defaultChannels.map(async (ch) => {
        const lastMsg = await Message.findOne({ channelId: ch.id }).sort({ createdAt: -1 });
        return {
          id: ch.id,
          name: ch.name,
          lastMessage: lastMsg ? `${lastMsg.senderName === req.user?.name ? 'You' : lastMsg.senderName}: ${lastMsg.content}` : 'No messages yet',
          time: lastMsg ? lastMsg.time || new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
          unreadCount: 0,
          isOnline: ch.isOnline
        };
      })
    );

    ApiResponse.success(res, { conversations });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error loading conversations', 500);
  }
}

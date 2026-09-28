import { Response } from 'express';
import { TeamInvitation } from '../models/TeamInvitation.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';

export async function createInvitation(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { project: projectId, receiver: receiverId, message, compatibilityScore, matchHighlights } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const existing = await TeamInvitation.findOne({
      project: projectId,
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending'
    });

    if (existing) {
      ApiResponse.error(res, 'A pending invitation already exists for this candidate.', 409);
      return;
    }

    const invitation = await TeamInvitation.create({
      project: projectId,
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending',
      message: message || '',
      compatibilityScore: compatibilityScore || 85,
      matchHighlights: matchHighlights || []
    });

    // Create notification & activity
    await createNotification(
      receiverId,
      'invitation',
      'New Team Invitation',
      `${req.user.name} invited you to collaborate on "${project.title}".`,
      project._id
    );

    await logActivity(req.user._id, 'INVITATION_SENT', project._id, {
      receiverId,
      projectTitle: project.title
    });

    const populated = await TeamInvitation.findById(invitation._id)
      .populate('sender', 'name email profileImage department skills')
      .populate('receiver', 'name email profileImage department skills')
      .populate('project', 'title category status');

    ApiResponse.created(res, { invitation: populated }, 'Team invitation sent successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error creating invitation', 500);
  }
}

export async function getMyInvitations(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const userId = req.user._id;

    const received = await TeamInvitation.find({ receiver: userId })
      .populate('sender', 'name email profileImage department skills semester')
      .populate('project', 'title category status')
      .sort({ createdAt: -1 });

    const sent = await TeamInvitation.find({ sender: userId })
      .populate('receiver', 'name email profileImage department skills semester')
      .populate('project', 'title category status')
      .sort({ createdAt: -1 });

    ApiResponse.success(res, { received, sent, incoming: received, outgoing: sent });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching invitations', 500);
  }
}

export async function respondToInvitation(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected' | 'canceled'

    if (!['accepted', 'rejected', 'canceled'].includes(status)) {
      ApiResponse.error(res, 'Invalid status response', 400);
      return;
    }

    const invitation = await TeamInvitation.findById(id);
    if (!invitation) {
      ApiResponse.error(res, 'Invitation not found', 404);
      return;
    }

    invitation.status = status;
    await invitation.save();

    const project = await Project.findById(invitation.project);

    if (status === 'accepted' && project) {
      const alreadyMember = project.members.some(
        (m) => m.user.toString() === invitation.receiver.toString()
      );

      if (!alreadyMember && project.members.length < project.maxMembers) {
        project.members.push({
          user: invitation.receiver,
          role: 'Collaborator',
          joinedAt: new Date()
        });
        await project.save();
      }

      await logActivity(invitation.receiver, 'INVITATION_ACCEPTED', project._id, {
        projectTitle: project.title
      });

      await createNotification(
        invitation.sender,
        'invitation',
        'Invitation Accepted',
        `${req.user.name} accepted your invitation to join "${project.title}".`,
        project._id
      );
    }

    ApiResponse.success(res, { invitation }, `Invitation ${status} successfully`);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error responding to invitation', 500);
  }
}

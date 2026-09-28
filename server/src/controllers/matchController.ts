import { Response } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { TeamRequest } from '../models/TeamRequest.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';
import { aiService } from '../services/ai/index.js';
import { logActivity } from '../services/activityService.js';

export async function getRecommendedTeammates(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const {
      projectId,
      domain,
      department,
      skills,
      skill,
      interests,
      interest,
      semester,
      availability,
      experience,
      search,
      includeDismissed
    } = req.query;

    let targetProject: any = null;
    if (projectId) {
      targetProject = await Project.findById(projectId);
    } else if (domain) {
      targetProject = { category: domain };
    }

    // Refresh current user to get latest dismissedRecommendations
    const currentUser = await User.findById(req.user._id);
    const dismissedIds = (currentUser?.dismissedRecommendations || []).map((id: any) => id.toString());

    // Build database candidate filter
    const queryFilter: Record<string, any> = {
      _id: { $ne: req.user._id },
      role: 'student',
      status: 'active'
    };

    if (includeDismissed !== 'true' && dismissedIds.length > 0) {
      queryFilter._id = { $nin: [req.user._id, ...dismissedIds] };
    }

    // 1. Department filter
    if (department && department !== 'All') {
      queryFilter.department = { $regex: new RegExp(department as string, 'i') };
    }

    // 2. Semester filter
    if (semester && semester !== 'All') {
      queryFilter.semester = { $regex: new RegExp(semester as string, 'i') };
    }

    // 3. Experience filter
    if (experience && experience !== 'All') {
      queryFilter.experience = { $regex: new RegExp(experience as string, 'i') };
    }

    // 4. Availability filter (minimum hours)
    if (availability && availability !== 'All') {
      const minHours = Number(availability);
      if (!isNaN(minHours)) {
        queryFilter.$or = [
          { availability: { $gte: minHours } },
          { availabilityHours: { $gte: minHours } }
        ];
      }
    }

    // 5. Skills filter
    const targetSkill = skills || skill;
    if (targetSkill && targetSkill !== 'All') {
      const skillRegex = new RegExp(targetSkill as string, 'i');
      queryFilter.skills = { $regex: skillRegex };
    }

    // 6. Interests filter
    const targetInterest = interests || interest;
    if (targetInterest && targetInterest !== 'All') {
      const interestRegex = new RegExp(targetInterest as string, 'i');
      queryFilter.interests = { $regex: interestRegex };
    }

    // 7. Search filter (Name, bio, skills, department)
    if (search && (search as string).trim()) {
      const sRegex = new RegExp((search as string).trim(), 'i');
      const searchConditions = [
        { name: sRegex },
        { bio: sRegex },
        { skills: sRegex },
        { department: sRegex },
        { preferredRole: sRegex }
      ];
      if (queryFilter.$or) {
        queryFilter.$and = [{ $or: queryFilter.$or }, { $or: searchConditions }];
        delete queryFilter.$or;
      } else {
        queryFilter.$or = searchConditions;
      }
    }

    const candidatePool = await User.find(queryFilter).select('-password');

    // Run AI multi-factor matching engine
    const matches = await aiService.matchTeammates(req.user, candidatePool, targetProject);

    res.json({ matches });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error generating teammate recommendations' });
  }
}

export async function sendTeamRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { toUserId, projectId, type = 'invite', message, compatibilityScore, matchHighlights } = req.body;

    if (!toUserId || !projectId) {
      res.status(400).json({ message: 'toUserId and projectId are required.' });
      return;
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if request already pending
    const existing = await TeamRequest.findOne({
      fromUser: req.user._id,
      toUser: toUserId,
      projectId,
      status: 'pending'
    });

    if (existing) {
      res.status(400).json({ message: 'A pending invitation already exists for this candidate on this project.' });
      return;
    }

    const request = new TeamRequest({
      project: projectId,
      sender: req.user._id,
      receiver: toUserId,
      status: 'pending',
      message: message || '',
      compatibilityScore: compatibilityScore ? Number(compatibilityScore) : 85,
      matchHighlights: Array.isArray(matchHighlights) ? matchHighlights : []
    });

    await request.save();

    // Create In-App Notification for recipient
    await Notification.create({
      user: toUserId,
      type: 'invitation',
      title: 'New Project Invitation',
      message: `${req.user.name} invited you to join "${project.title}" (${compatibilityScore || 85}% match score).`,
      relatedProject: project._id
    });

    await logActivity(req.user._id, 'PROJECT_INVITATION_SENT', project._id, {
      toUser: toUserId,
      projectTitle: project.title
    });

    const populated: any = await TeamRequest.findById(request._id)
      .populate('sender', 'name email avatar profileImage department skills')
      .populate('receiver', 'name email avatar profileImage department skills')
      .populate('project', 'title category status');

    const formattedRequest = {
      ...(populated?.toObject() || {}),
      fromUser: populated?.sender,
      toUser: populated?.receiver,
      projectId: populated?.project
    };

    res.status(201).json({ message: 'Team invitation sent successfully', request: formattedRequest });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error sending team invitation' });
  }
}

export async function addToTeam(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { userId, projectId, role = 'Teammate' } = req.body;

    if (!userId || !projectId) {
      res.status(400).json({ message: 'userId and projectId are required.' });
      return;
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Validate permission: req.user must be project owner/lead
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isLead = (project.lead && project.lead.toString() === req.user._id.toString());
    if (!isOwner && !isLead && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only project owners can directly add teammates.' });
      return;
    }

    // Check if user is already a member
    const isMember = project.members.some((m) => m.user.toString() === userId.toString());
    if (isMember) {
      res.status(400).json({ message: 'This student is already a member of the project team.' });
      return;
    }

    if (project.members.length >= (project.maxMembers || 5)) {
      res.status(400).json({ message: `Project team has reached maximum capacity (${project.maxMembers || 5} members).` });
      return;
    }

    // Add candidate to team
    project.members.push({
      user: userId,
      role,
      joinedAt: new Date()
    });

    await project.save();

    // Create In-App Notification for the added student
    await Notification.create({
      user: userId,
      type: 'project_update',
      title: 'Added to Project Team',
      message: `You have been added to "${project.title}" as ${role} by ${req.user.name}.`,
      relatedProject: project._id
    });

    await logActivity(req.user._id, 'TEAMMATE_ADDED', project._id, {
      addedUser: userId,
      projectTitle: project.title,
      role
    });

    const populatedProject = await Project.findById(project._id)
      .populate('members.user', 'name email avatar profileImage department skills')
      .populate('owner', 'name email');

    res.json({
      message: 'Teammate added to project successfully',
      project: populatedProject
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error adding teammate to project' });
  }
}

export async function dismissRecommendation(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { candidateId } = req.params;
    if (!candidateId) {
      res.status(400).json({ message: 'candidateId is required' });
      return;
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { dismissedRecommendations: candidateId }
    });

    res.json({ message: 'Recommendation dismissed successfully', candidateId });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error dismissing recommendation' });
  }
}

export async function restoreRecommendation(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { candidateId } = req.params;
    if (!candidateId) {
      res.status(400).json({ message: 'candidateId is required' });
      return;
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { dismissedRecommendations: candidateId }
    });

    res.json({ message: 'Recommendation restored successfully', candidateId });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error restoring recommendation' });
  }
}

export async function getMyRequests(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const userId = req.user._id;

    const incomingRaw = await TeamRequest.find({
      $or: [{ receiver: userId }, { toUser: userId }]
    })
      .populate('sender', 'name email avatar profileImage department skills preferredRole year semester availability')
      .populate('project', 'title category status description')
      .sort({ createdAt: -1 });

    const outgoingRaw = await TeamRequest.find({
      $or: [{ sender: userId }, { fromUser: userId }]
    })
      .populate('receiver', 'name email avatar profileImage department skills preferredRole year semester availability')
      .populate('project', 'title category status description')
      .sort({ createdAt: -1 });

    const formatReq = (r: any) => {
      const obj = r.toObject ? r.toObject() : r;
      return {
        ...obj,
        fromUser: obj.fromUser || obj.sender,
        toUser: obj.toUser || obj.receiver,
        projectId: obj.projectId || obj.project
      };
    };

    res.json({
      incoming: incomingRaw.map(formatReq),
      outgoing: outgoingRaw.map(formatReq)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching team requests' });
  }
}

export async function respondToRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      res.status(400).json({ message: 'Status must be either accepted or rejected.' });
      return;
    }

    const request = await TeamRequest.findById(id);
    if (!request) {
      res.status(404).json({ message: 'Team request not found' });
      return;
    }

    request.status = status;
    await request.save();

    // If accepted, add the appropriate user to the project
    if (status === 'accepted') {
      const project = await Project.findById(request.projectId);
      if (project) {
        const userToAddId = request.type === 'join_request' ? request.fromUser : request.toUser;
        const alreadyIn = project.members.some((m) => m.user.toString() === userToAddId.toString());
        if (!alreadyIn && project.members.length < (project.maxMembers || 5)) {
          project.members.push({
            user: userToAddId,
            role: 'Teammate',
            joinedAt: new Date()
          });
          await project.save();
        }
      }

      // Notify the requester that their request was accepted
      await Notification.create({
        user: request.fromUser,
        type: 'project_update',
        title: 'Invitation Accepted!',
        message: `Your invitation for project has been accepted!`,
        relatedProject: request.projectId
      });
    }

    res.json({ message: `Request ${status} successfully`, request });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error responding to team request' });
  }
}

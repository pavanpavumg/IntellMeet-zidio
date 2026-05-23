import { Request, Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';
import Workspace from '../models/Workspace';
import User from '../models/User';

export const generateMeetingToken = async (req: Request, res: Response) => {
  try {
    const { id: meetingId } = req.params;
    
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 1. Validate Access (Matches Requirement #3)
    // We assume the meeting room is tied to their workspace for this MVP.
    const workspace = await Workspace.findById(meetingId);
    if (!workspace) {
      return res.status(404).json({ message: 'Meeting/Workspace not found' });
    }

    const isMember = workspace.members.some((memberId: any) => memberId.toString() === user.id);
    const isOwner = workspace.owner.toString() === user.id;
    if (!isMember && !isOwner) {
      return res.status(403).json({ message: 'Access denied to this meeting' }); // Blocked!
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ message: 'LiveKit configuration is missing on the server' });
    }

    // 2. Generate the Token natively via LiveKit 
    const participantName = user.name || 'Anonymous User';

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: participantName,
      ttl: '10m', // Requirement #2: Prevent misuse via TTL
    });

    at.addGrant({
      roomJoin: true,
      room: meetingId, // Requirement #4: Dynamic binding to their Workspace string
      canPublish: true,
      canSubscribe: true,
      canPublishData: true, // Fix for DataChannel useChat errors!
    });

    const token = await at.toJwt();

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({ message: 'Failed to generate token', error });
  }
};

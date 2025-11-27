import { Request, Response } from 'express';
import * as friendshipService from '../friendship/friendship.services';///./friendship.service

export const addFriend = async (req: Request, res: Response) => {
  const friendship = await friendshipService.sendRequest((req as any).user.id, req.body.receiverId);
  res.json(friendship);
};

export const accept = async (req: Request, res: Response) => {
  const friendship = await friendshipService.accept(req.body.id);
  res.json(friendship);
};

export const reject = async (req: Request, res: Response) => {
  const friendship = await friendshipService.reject(req.body.id);
  res.json(friendship);
};

export const getFriends = async (req: Request, res: Response) => {
  const friends = await friendshipService.getFriends((req as any).user.id);
  res.json(friends);
};
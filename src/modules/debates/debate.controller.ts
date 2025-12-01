import { Request, Response } from 'express';
import * as debateService from './debate.service';

export const createDebate = async (req: Request, res: Response) => {
  const debate = await debateService.createDebate((req as any).user.id, req.body.user2Id, req.body.lawId, req.body.theme);
  res.json(debate);
};

export const accept = async (req: Request, res: Response) => {
  const debate = await debateService.acceptDebate(req.params.id);
  res.json(debate);
};

export const addArgument = async (req: Request, res: Response) => {
  const debate = await debateService.addArgument(req.params.id, (req as any).user.id, req.body.argument);
  res.json(debate);
};

export const vote = async (req: Request, res: Response) => {
  const debate = await debateService.votePublic(req.params.id, (req as any).user.id, req.body.voteForUser1);
  res.json(debate);
};

export const getDebate = async (req: Request, res: Response) => {
  const debate = await debateService.getDebateById(req.params.id);  // Add this method if needed
  res.json(debate);
};
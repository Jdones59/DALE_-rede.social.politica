import { Request, Response } from 'express';
import * as voteService from './vote.service';

export const vote = async (req: Request, res: Response) => {
  const vote = await voteService.vote(req.body.lawId, (req as any).user.id, req.body.vote);
  res.json(vote);
};
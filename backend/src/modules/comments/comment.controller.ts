import { Request, Response } from 'express';
import * as commentService from './comment.service';

export const createComment = async (req: Request, res: Response) => {
  const comment = await commentService.createComment(req.body.lawId, (req as any).user.id, req.body.text);
  res.status(201).json(comment);
};

export const getComments = async (req: Request, res: Response) => {
  const comments = await commentService.getCommentsForLaw(req.params.id, (req as any).user.id);
  res.json(comments);
};
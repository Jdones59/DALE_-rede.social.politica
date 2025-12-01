import express from 'express';
import * as voteController from './vote.controller';
import authMiddleware from '../../utils/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, voteController.vote);

export default router;
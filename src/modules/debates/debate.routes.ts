import express from 'express';
import * as debateController from './debate.controller';
import authMiddleware from '../../utils/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, debateController.createDebate);
router.post('/:id/accept', authMiddleware, debateController.accept);
router.post('/:id/argument', authMiddleware, debateController.addArgument);
router.post('/:id/vote', authMiddleware, debateController.vote);
router.get('/:id', authMiddleware, debateController.getDebate);

export default router;
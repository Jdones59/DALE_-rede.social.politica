import express from 'express';
import * as commentController from './comment.controller';
import { authMiddleware } from '../../utils/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, commentController.createComment);
router.get('/laws/:id/comments', authMiddleware, commentController.getComments);

export default router;
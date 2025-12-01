import express from 'express';
import * as friendshipController from './friendship.controller';
import authMiddleware from '../../utils/authMiddleware';

const router = express.Router();

router.get('/friends', authMiddleware, friendshipController.getFriends);
router.post('/add', authMiddleware, friendshipController.addFriend);
router.post('/accept', authMiddleware, friendshipController.accept);
router.post('/reject', authMiddleware, friendshipController.reject);

export default router;
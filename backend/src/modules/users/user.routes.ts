import express from 'express';
import * as userController from '../auth/user.controller';
import { authMiddleware } from '../../utils/authMiddleware';

const router = express.Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/perfil', authMiddleware, userController.updateProfile);
router.get('/user/:id', authMiddleware, userController.getUser);

export default router;
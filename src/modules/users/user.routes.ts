import express from 'express';
import { UserController } from './user.controller';
import { userService } from './user.service';
import authMiddleware from '../../utils/authMiddleware';

const router = express.Router();
const controller = new (UserController as any)(userService);

router.get('/me', authMiddleware, async (req, res) => res.json(await controller.me(req)));
router.put('/perfil', authMiddleware, async (req, res) => res.json(await controller.updateMe(req, req.body)));
router.get('/user/:id', authMiddleware, async (req, res) => res.json(await controller.getById(req.params.id)));

export default router;
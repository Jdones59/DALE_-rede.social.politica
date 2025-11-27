import express from 'express';
import * as lawController from './law.controller';
import { authMiddleware } from '../../utils/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, lawController.getLaws);
router.get('/:id', authMiddleware, lawController.getLaw);

export default router;
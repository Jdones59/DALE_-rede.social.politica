import { Router } from 'express';
import { CommentController } from './comment.controller';


const router = Router();
const controller = new (CommentController as any)();


router.get('/law/:lawId', (req, res) => controller.list(req.params.lawId).then((r: any) => res.json(r)));


export default router;
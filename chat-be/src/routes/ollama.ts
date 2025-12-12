import { Router } from "express";
import * as ctrl from '../controllers/ollamaController';

const router = Router();
router.get('/ps', ctrl.ps);
router.get('/list', ctrl.list);
router.post('/chat', ctrl.chat);
router.post('/abort', ctrl.abort);
router.post('/pull', ctrl.pull);
router.delete('/delete', ctrl.del);
export default router;
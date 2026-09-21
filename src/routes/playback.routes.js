import { Router } from 'express';
import * as controller from '../modules/playback/playback.controller.js';
const router = Router();
router.get('/', controller.index);
export default router;

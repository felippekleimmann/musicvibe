import { Router } from 'express';
import * as controller from '../modules/album/album.controller.js';
const router = Router();
router.get('/', controller.index);
export default router;

import { Router } from 'express';
import * as controller from '../modules/health/health.controller.js';
const router = Router();
router.get('/', controller.index);
export default router;

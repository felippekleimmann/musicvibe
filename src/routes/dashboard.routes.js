import { Router } from 'express';
import * as controller from '../modules/dashboard/dashboard.controller.js';
const router = Router();
router.get('/', controller.index);
export default router;

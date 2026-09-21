import { Router } from 'express';
import * as controller from '../modules/genre/genre.controller.js';
const router = Router();
router.get('/', controller.index);
export default router;

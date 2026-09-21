import { Router } from 'express';
import * as controller from '../modules/user/user.controller.js';

const router = Router();

router.get('/', controller.index);
router.post('/', controller.register);
router.get('/:id', controller.getById);
router.put('/:id', controller.updateRole);

export default router;

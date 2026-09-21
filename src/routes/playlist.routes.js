import { Router } from 'express';
import * as controller from '../modules/playlist/playlist.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', controller.listPublic);
router.get('/mine', isAuthenticated, controller.listMine);
router.post('/', isAuthenticated, controller.create);
router.get('/:id', controller.getById);
router.post('/:id/tracks', isAuthenticated, controller.addTrack);
router.delete('/:id/tracks/:trackId', isAuthenticated, controller.removeTrack);
router.delete('/:id', isAuthenticated, controller.remove);

export default router;

import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/search', usersController.search);
router.post('/:id/block', usersController.block);
router.delete('/:id/block', usersController.unblock);
router.post('/:id/report', usersController.report);
router.delete('/me', usersController.deleteAccount);

export default router;

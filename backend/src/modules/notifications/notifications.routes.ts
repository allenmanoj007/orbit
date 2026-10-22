import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.getList);
router.patch('/:id/read', notificationsController.markRead);
router.post('/read-all', notificationsController.markAllRead);
router.post('/device', notificationsController.registerDevice);

export default router;

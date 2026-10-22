import { Router } from 'express';
import { callsController } from './calls.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/initiate', callsController.initiate);
router.patch('/:id/status', callsController.updateStatus);
router.get('/history', callsController.getHistory);
router.get('/ice-servers', callsController.getIceServers);

export default router;

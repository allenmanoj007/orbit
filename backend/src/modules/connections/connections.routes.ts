import { Router } from 'express';
import { connectionsController } from './connections.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { sendConnectionRequestSchema } from './connections.schema';

const router = Router();

router.use(authenticate);

router.post('/request', validate(sendConnectionRequestSchema), connectionsController.sendRequest);
router.post('/:id/accept', connectionsController.acceptRequest);
router.post('/:id/decline', connectionsController.declineRequest);
router.delete('/:id', connectionsController.removeConnection);
router.get('/', connectionsController.getConnections);
router.get('/pending', connectionsController.getPending);

export default router;

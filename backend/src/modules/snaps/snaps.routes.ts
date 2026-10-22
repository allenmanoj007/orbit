import { Router } from 'express';
import { snapsController } from './snaps.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createSnapSchema, createNearbySnapSchema } from './snaps.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createSnapSchema), snapsController.createSnap);
router.post('/nearby', validate(createNearbySnapSchema), snapsController.createNearbySnap);
router.get('/nearby', snapsController.getNearbySnaps);
router.post('/:id/view', snapsController.viewSnap);

export default router;

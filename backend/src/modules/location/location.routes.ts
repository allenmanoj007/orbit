import { Router } from 'express';
import { locationController } from './location.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { updateLocationSchema } from './location.schema';

const router = Router();

router.use(authenticate);

router.post('/update', validate(updateLocationSchema), locationController.updateLocation);
router.get('/nearby', locationController.getNearbyUsers);

export default router;

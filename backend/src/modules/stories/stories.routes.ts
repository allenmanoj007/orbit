import { Router } from 'express';
import { storiesController } from './stories.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', storiesController.createStory);
router.get('/feed', storiesController.getFeed);
router.post('/:id/view', storiesController.viewStory);

export default router;

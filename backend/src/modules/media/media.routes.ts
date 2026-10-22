import { Router } from 'express';
import { mediaController } from './media.controller';
import { authenticate } from '../../middleware/auth';
import { uploadSingle } from '../../middleware/upload';

const router = Router();

router.use(authenticate);

router.post('/upload', uploadSingle, mediaController.upload);

export default router;

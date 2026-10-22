import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Only authenticated admins can access
router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.post('/users/:id/ban', adminController.banUser);
router.post('/users/:id/unban', adminController.unbanUser);
router.get('/reports', adminController.getReports);
router.patch('/reports/:id', adminController.updateReport);
router.get('/interests', adminController.getInterests);
router.post('/interests', adminController.createInterest);
router.get('/hobbies', adminController.getHobbies);
router.post('/hobbies', adminController.createHobby);

export default router;

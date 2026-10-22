import { Router } from 'express';
import { profilesController } from './profiles.controller';
import { authenticate, optionalAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  updateProfileSchema,
  updatePrivacySchema,
  updateLocationPreferenceSchema,
  addInterestsSchema,
  addHobbiesSchema,
} from './profiles.schema';

const router = Router();

router.get('/me', authenticate, profilesController.getMyProfile);
router.patch('/me', authenticate, validate(updateProfileSchema), profilesController.updateProfile);
router.put('/me/interests', authenticate, validate(addInterestsSchema), profilesController.setInterests);
router.put('/me/hobbies', authenticate, validate(addHobbiesSchema), profilesController.setHobbies);
router.patch('/me/privacy', authenticate, validate(updatePrivacySchema), profilesController.updatePrivacy);
router.patch('/me/location-preferences', authenticate, validate(updateLocationPreferenceSchema), profilesController.updateLocationPreferences);

// View public profile by userId
router.get('/:userId', optionalAuth, profilesController.getProfileById);

export default router;

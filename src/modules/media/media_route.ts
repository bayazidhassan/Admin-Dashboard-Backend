import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/multer';
import { MediaController } from './media_controller';
import {
  getMediaByIdValidationSchema,
  updateMediaMetadataValidationSchema,
} from './media_validation';

const router = Router();

router.post(
  '/upload',
  authenticate,
  authorize('media:create'),
  upload.array('files', 10),
  MediaController.uploadMedia,
);

router.get(
  '/',
  authenticate,
  authorize('media:read'),
  MediaController.getMediaList,
);

router.get(
  '/:id',
  authenticate,
  authorize('media:read'),
  validateRequest(getMediaByIdValidationSchema),
  MediaController.getMediaById,
);

router.patch(
  '/:id',
  authenticate,
  authorize('media:update'),
  validateRequest(updateMediaMetadataValidationSchema),
  MediaController.updateMediaMetadata,
);

export const MediaRoutes = router;

import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import { upload } from '../../utils/multer';
import { MediaController } from './media_controller';

const router = Router();

router.post(
  '/upload',
  authenticate,
  authorize('media:create'),
  upload.array('files', 10),
  MediaController.uploadMedia,
);

export const MediaRoutes = router;

import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category_controller';
import { createCategoryValidationSchema } from './category_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('category:create'),
  validateRequest(createCategoryValidationSchema),
  CategoryController.createCategory,
);

export const CategoryRoutes = router;

import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category_controller';
import {
  createCategoryValidationSchema,
  getCategoryByIdValidationSchema,
} from './category_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('category:create'),
  validateRequest(createCategoryValidationSchema),
  CategoryController.createCategory,
);

router.get(
  '/',
  authenticate,
  authorize('category:read'),
  CategoryController.getCategories,
);

router.get(
  '/:id',
  authenticate,
  authorize('category:read'),
  validateRequest(getCategoryByIdValidationSchema),
  CategoryController.getCategoryById,
);

export const CategoryRoutes = router;

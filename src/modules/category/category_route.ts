import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category_controller';
import {
  createCategoryValidationSchema,
  getCategoryByIdValidationSchema,
  updateCategoryValidationSchema,
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
  '/tree',
  authenticate,
  authorize('category:read'),
  CategoryController.getCategoryTree,
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

router.patch(
  '/:id',
  authenticate,
  authorize('category:update'),
  validateRequest(updateCategoryValidationSchema),
  CategoryController.updateCategory,
);

router.delete(
  '/:id',
  authenticate,
  authorize('category:delete'),
  validateRequest(getCategoryByIdValidationSchema),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;

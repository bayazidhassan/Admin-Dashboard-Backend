import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { BrandController } from './brand_controller';
import {
  createBrandValidationSchema,
  getBrandByIdValidationSchema,
  updateBrandValidationSchema,
} from './brand_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('brand:create'),
  validateRequest(createBrandValidationSchema),
  BrandController.createBrand,
);

router.get(
  '/',
  authenticate,
  authorize('brand:read'),
  BrandController.getBrands,
);

router.get(
  '/:id',
  authenticate,
  authorize('brand:read'),
  validateRequest(getBrandByIdValidationSchema),
  BrandController.getBrandById,
);

router.patch(
  '/:id',
  authenticate,
  authorize('brand:update'),
  validateRequest(updateBrandValidationSchema),
  BrandController.updateBrand,
);

router.delete(
  '/:id',
  authenticate,
  authorize('brand:delete'),
  validateRequest(getBrandByIdValidationSchema),
  BrandController.deleteBrand,
);

export const BrandRoutes = router;

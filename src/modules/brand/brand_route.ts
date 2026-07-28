import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { BrandController } from './brand_controller';
import { createBrandValidationSchema } from './brand_validation';

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

export const BrandRoutes = router;

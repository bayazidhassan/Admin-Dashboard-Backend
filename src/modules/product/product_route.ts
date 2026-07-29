import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product_controller';
import {
  createProductValidationSchema,
  createVariableProductValidationSchema,
  getProductByIdValidationSchema,
  updateProductValidationSchema,
  updateVariantValidationSchema,
} from './product_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('product:create'),
  validateRequest(createProductValidationSchema),
  ProductController.createProduct,
);

router.get(
  '/',
  authenticate,
  authorize('product:read'),
  ProductController.getProducts,
);

router.post(
  '/variable',
  authenticate,
  authorize('product:create'),
  validateRequest(createVariableProductValidationSchema),
  ProductController.createVariableProduct,
);

router.patch(
  '/variants/:variantId',
  authenticate,
  authorize('product:update'),
  validateRequest(updateVariantValidationSchema),
  ProductController.updateVariant,
);

router.delete(
  '/variants/:variantId',
  authenticate,
  authorize('product:delete'),
  validateRequest(updateVariantValidationSchema.pick({ params: true })),
  ProductController.deleteVariant,
);

router.get(
  '/:id',
  authenticate,
  authorize('product:read'),
  validateRequest(getProductByIdValidationSchema),
  ProductController.getProductById,
);

router.patch(
  '/:id',
  authenticate,
  authorize('product:update'),
  validateRequest(updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete(
  '/:id',
  authenticate,
  authorize('product:delete'),
  validateRequest(getProductByIdValidationSchema),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;

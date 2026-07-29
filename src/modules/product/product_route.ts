import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product_controller';
import {
  addVariantValidationSchema,
  attachAttributeValueMediaValidationSchema,
  attachProductMediaValidationSchema,
  attachVariantMediaValidationSchema,
  createProductValidationSchema,
  createVariableProductValidationSchema,
  detachAttributeValueMediaValidationSchema,
  detachProductMediaValidationSchema,
  detachVariantMediaValidationSchema,
  generateVariantsValidationSchema,
  getProductByIdValidationSchema,
  reorderProductMediaValidationSchema,
  updateProductValidationSchema,
  updateVariableProductValidationSchema,
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

router.post(
  '/variable',
  authenticate,
  authorize('product:create'),
  validateRequest(createVariableProductValidationSchema),
  ProductController.createVariableProduct,
);

router.post(
  '/generate-variants',
  authenticate,
  authorize('product:create'),
  validateRequest(generateVariantsValidationSchema),
  ProductController.generateVariants,
);

router.post(
  '/:id/variants',
  authenticate,
  authorize('product:update'),
  validateRequest(addVariantValidationSchema),
  ProductController.addVariant,
);

router.post(
  '/:id/media',
  authenticate,
  authorize('product:update'),
  validateRequest(attachProductMediaValidationSchema),
  ProductController.attachProductMedia,
);

router.post(
  '/variants/:variantId/media',
  authenticate,
  authorize('product:update'),
  validateRequest(attachVariantMediaValidationSchema),
  ProductController.attachVariantMedia,
);

router.post(
  '/attribute-values/:valueId/media',
  authenticate,
  authorize('product:update'),
  validateRequest(attachAttributeValueMediaValidationSchema),
  ProductController.attachAttributeValueMedia,
);

router.get(
  '/',
  authenticate,
  authorize('product:read'),
  ProductController.getProducts,
);

router.get(
  '/:id',
  authenticate,
  authorize('product:read'),
  validateRequest(getProductByIdValidationSchema),
  ProductController.getProductById,
);

router.patch(
  '/variants/:variantId',
  authenticate,
  authorize('product:update'),
  validateRequest(updateVariantValidationSchema),
  ProductController.updateVariant,
);

router.patch(
  '/variable/:id',
  authenticate,
  authorize('product:update'),
  validateRequest(updateVariableProductValidationSchema),
  ProductController.updateVariableProduct,
);

router.patch(
  '/:id/media/reorder',
  authenticate,
  authorize('product:update'),
  validateRequest(reorderProductMediaValidationSchema),
  ProductController.reorderProductMedia,
);

router.patch(
  '/:id',
  authenticate,
  authorize('product:update'),
  validateRequest(updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete(
  '/:id/media/:mediaId',
  authenticate,
  authorize('product:update'),
  validateRequest(detachProductMediaValidationSchema),
  ProductController.detachProductMedia,
);

router.delete(
  '/variants/:variantId/media/:mediaId',
  authenticate,
  authorize('product:update'),
  validateRequest(detachVariantMediaValidationSchema),
  ProductController.detachVariantMedia,
);

router.delete(
  '/attribute-values/:valueId/media/:mediaId',
  authenticate,
  authorize('product:update'),
  validateRequest(detachAttributeValueMediaValidationSchema),
  ProductController.detachAttributeValueMedia,
);

router.delete(
  '/variants/:variantId',
  authenticate,
  authorize('product:delete'),
  validateRequest(updateVariantValidationSchema.pick({ params: true })),
  ProductController.deleteVariant,
);

router.delete(
  '/:id',
  authenticate,
  authorize('product:delete'),
  validateRequest(getProductByIdValidationSchema),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;

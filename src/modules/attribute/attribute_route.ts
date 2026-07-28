import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { AttributeController } from './attribute_controller';
import {
  addAttributeValueValidationSchema,
  createAttributeValidationSchema,
  getAttributeByIdValidationSchema,
  updateAttributeValidationSchema,
} from './attribute_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('attribute:create'),
  validateRequest(createAttributeValidationSchema),
  AttributeController.createAttribute,
);

router.get(
  '/',
  authenticate,
  authorize('attribute:read'),
  AttributeController.getAttributes,
);

router.get(
  '/:id',
  authenticate,
  authorize('attribute:read'),
  validateRequest(getAttributeByIdValidationSchema),
  AttributeController.getAttributeById,
);

router.patch(
  '/:id',
  authenticate,
  authorize('attribute:update'),
  validateRequest(updateAttributeValidationSchema),
  AttributeController.updateAttribute,
);

router.delete(
  '/:id',
  authenticate,
  authorize('attribute:delete'),
  validateRequest(getAttributeByIdValidationSchema),
  AttributeController.deleteAttribute,
);

router.post(
  '/:id/values',
  authenticate,
  authorize('attribute:update'),
  validateRequest(addAttributeValueValidationSchema),
  AttributeController.addAttributeValue,
);

export const AttributeRoutes = router;

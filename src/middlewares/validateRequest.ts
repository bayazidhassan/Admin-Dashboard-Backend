import { ZodSchema } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: ZodSchema) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  });
};

export default validateRequest;
